<?php
/* ==========================================================================
   Folio — the signed-in user's CVs

   GET    api/cvs.php          → { cvs: [ {id, title, titleAuto, template, updatedAt} ] }, newest first
   GET    api/cvs.php?id=5     → { cv: {id, title, titleAuto, template, updatedAt, content} }
   POST   api/cvs.php          { template, title?, content? }       → 201 { cv }
   PATCH  api/cvs.php?id=5     { content?, title?, personName? }    → { cv }
   DELETE api/cvs.php?id=5     → { ok: true }

   - Every query also checks user_id, so nobody can open someone else's CV.
   - title: a chosen title (from then on title_auto = 0).
     personName: the name on the CV; while title_auto = 1 the title follows
     it ("Sam de Vries - cv").
   ========================================================================== */

require __DIR__ . '/session.php';

$user = require_login();
$userId = (int) $user['id'];
$id = (int) ($_GET['id'] ?? 0);

const DEFAULT_TITLE = 'Nieuw cv';
const TEMPLATES = ['modern', 'classic', 'minimal', 'split', 'timeline', 'concise'];
const MAX_CONTENT_BYTES = 200000; // a full CV is a few kB; this stops abuse

// The part of a row the list on My resumes needs.
function cv_summary(array $row): array
{
    return [
        'id'        => (int) $row['id'],
        'title'     => $row['title'],
        'titleAuto' => (bool) $row['title_auto'],
        'template'  => $row['template'],
        'updatedAt' => strtotime($row['updated_at']) * 1000, // milliseconds, like JavaScript's Date.now()
    ];
}

function find_cv(int $id, int $userId): array
{
    $query = db()->prepare('SELECT * FROM cvs WHERE id = ? AND user_id = ?');
    $query->execute([$id, $userId]);
    $row = $query->fetch();
    if (!$row) {
        send_json(404, ['message' => 'This CV does not exist (anymore).']);
    }
    return $row;
}

function auto_title(string $personName): string
{
    $name = trim($personName);
    return $name === '' ? DEFAULT_TITLE : mb_substr($name, 0, 140) . ' - cv';
}

function valid_template($template): string
{
    return in_array($template, TEMPLATES, true) ? $template : TEMPLATES[0];
}

// The CV content exactly as the browser sent it. Decoded as objects (not
// PHP arrays), so an empty {} stays {} and does not come back as [].
function raw_content()
{
    $body = json_decode(file_get_contents('php://input'));
    return is_object($body) && isset($body->content) ? $body->content : null;
}

// The editor's content as JSON text, or an error answer.
function content_json($content): string
{
    if (!is_object($content)) {
        send_json(422, ['message' => 'The CV could not be read. Please try again.']);
    }
    $json = json_encode($content, JSON_UNESCAPED_UNICODE);
    if ($json === false || strlen($json) > MAX_CONTENT_BYTES) {
        send_json(422, ['message' => 'This CV is too large to save.']);
    }
    return $json;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if ($id) {
            $row = find_cv($id, $userId);
            $cv = cv_summary($row);
            $cv['content'] = json_decode($row['content']); // objects: {} stays {}
            send_json(200, ['cv' => $cv]);
        }

        $query = db()->prepare(
            'SELECT id, title, title_auto, template, updated_at FROM cvs WHERE user_id = ? ORDER BY updated_at DESC, id DESC'
        );
        $query->execute([$userId]);
        send_json(200, ['cvs' => array_map('cv_summary', $query->fetchAll())]);

    case 'POST':
        $data = read_json();
        $template = valid_template($data['template'] ?? null);
        $content = raw_content();
        if (!is_object($content)) {
            $content = (object) ['version' => 1, 'updatedAt' => null];
        }
        $content->template = $template;
        if (!isset($content->sections) || !is_object($content->sections)) {
            $content->sections = new stdClass();
        }

        // A new CV starts with the details from the account (Personal details page).
        $personal = $content->sections->personal ?? null;
        if (!is_object($personal) || !array_filter((array) $personal)) {
            $website = $user['website'] ?? '';
            $content->sections->personal = (object) array_filter([
                'name'     => trim($user['first_name'] . ' ' . $user['last_name']),
                'title'    => $user['job_title'] ?? '',
                'email'    => $user['email'],
                'phone'    => $user['phone'] ?? '',
                'city'     => $user['city'] ?? '',
                'linkedin' => stripos($website, 'linkedin') !== false ? $website : '',
                'website'  => stripos($website, 'linkedin') === false ? $website : '',
            ]);
        }

        $title = text_field($data, 'title');
        $titleAuto = $title === '';
        if ($titleAuto) {
            $title = auto_title((string) ($content->sections->personal->name ?? ''));
        }

        $query = db()->prepare(
            'INSERT INTO cvs (user_id, title, title_auto, template, content) VALUES (?, ?, ?, ?, ?)'
        );
        $query->execute([$userId, mb_substr($title, 0, 150), $titleAuto ? 1 : 0, $template, content_json($content)]);

        send_json(201, ['cv' => cv_summary(find_cv((int) db()->lastInsertId(), $userId))]);

    case 'PATCH':
        $row = find_cv($id, $userId);
        $data = read_json();
        $set = [];
        $values = [];

        if (array_key_exists('content', $data)) {
            $content = raw_content();
            $set[] = 'content = ?';
            $values[] = content_json($content);
            $set[] = 'template = ?';
            $values[] = valid_template($content->template ?? null);
        }

        $title = text_field($data, 'title');
        if ($title !== '') {
            $set[] = 'title = ?';
            $values[] = mb_substr($title, 0, 150);
            $set[] = 'title_auto = 0';
        } elseif (array_key_exists('personName', $data) && $row['title_auto']) {
            $set[] = 'title = ?';
            $values[] = auto_title(text_field($data, 'personName'));
        }

        if (!$set) {
            send_json(422, ['message' => 'Nothing to save.']);
        }

        // Only a new title: keep "last edited" as it was.
        if (!array_key_exists('content', $data)) {
            $set[] = 'updated_at = updated_at';
        }

        $values[] = $id;
        $values[] = $userId;
        $query = db()->prepare('UPDATE cvs SET ' . implode(', ', $set) . ' WHERE id = ? AND user_id = ?');
        $query->execute($values);

        send_json(200, ['cv' => cv_summary(find_cv($id, $userId))]);

    case 'DELETE':
        $query = db()->prepare('DELETE FROM cvs WHERE id = ? AND user_id = ?');
        $query->execute([$id, $userId]);
        if (!$query->rowCount()) {
            send_json(404, ['message' => 'This CV does not exist (anymore).']);
        }
        send_json(200, ['ok' => true]);

    default:
        header('Allow: GET, POST, PATCH, DELETE');
        send_json(405, ['message' => 'This method is not allowed here.']);
}
