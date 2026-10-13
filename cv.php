<?php
/* ==========================================================================
   Folio — a shared CV: the page behind the personal link

   cv.php?c=<code>   anyone with the link sees the CV, read-only, no account
                     needed. The code comes from api/share.php.

   This is PHP and not .html because LinkedIn and WhatsApp read the title
   and description for their link preview from the page itself; they don't
   run JavaScript. The CV itself is drawn by js/cv-render.js, the same code
   as the previews on My resumes.

   On purpose (for now): no download button and no "Made with Folio".
   ========================================================================== */

require __DIR__ . '/api/db.php';

ini_set('display_errors', '0');

// Search engines may not list shared CVs, and a link that is switched off
// must stop working straight away (no copies in a cache).
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

$code = (string) ($_GET['c'] ?? '');
$cv = null;
$failed = false;

if (preg_match('/^[0-9a-f]{32}$/', $code)) {
    try {
        $query = db()->prepare('SELECT title, content FROM cvs WHERE share_token = ?');
        $query->execute([$code]);
        $cv = $query->fetch() ?: null;
    } catch (Throwable $error) {
        error_log('Folio cv.php: ' . $error->getMessage());
        $failed = true;
    }
}

function e(string $text): string
{
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

const ASSET_VERSION = 39; // the same ?v= as the .html pages

if ($cv) {
    // As objects (not PHP arrays), so an empty {} stays {} and not [].
    $content = json_decode($cv['content']);
    if (!is_object($content)) {
        $content = new stdClass();
    }
    $language = ($content->language ?? '') === 'en' ? 'en' : 'nl';
    $personal = $content->sections->personal ?? null;
    $name = is_string($personal->name ?? null) ? trim($personal->name) : '';
    $role = is_string($personal->title ?? null) ? trim($personal->title) : '';
    $pageTitle = $name !== '' ? $name . ($language === 'en' ? ' – CV' : ' – cv') : $cv['title'];
} else {
    http_response_code($failed ? 503 : 404);
    $language = null;
}
?>
<!DOCTYPE html>
<html lang="<?= $language ?? 'nl' ?>"<?= $language ? ' data-fixed-lang="' . $language . '"' : '' ?>>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
<?php if ($cv): ?>
    <title><?= e($pageTitle) ?></title>
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="<?= e($pageTitle) ?>" />
<?php if ($role !== ''): ?>
    <meta name="description" content="<?= e($role) ?>" />
    <meta property="og:description" content="<?= e($role) ?>" />
<?php endif; ?>
<?php else: ?>
    <title>Cv niet gevonden · Folio</title>
<?php endif; ?>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/colors.css?v=<?= ASSET_VERSION ?>" />
    <link rel="stylesheet" href="css/base.css?v=<?= ASSET_VERSION ?>" />
    <link rel="stylesheet" href="css/cv-templates.css?v=<?= ASSET_VERSION ?>" />
    <link rel="stylesheet" href="css/cv-share.css?v=<?= ASSET_VERSION ?>" />
  </head>

  <body class="cv-share-body">
<?php if ($cv): ?>
    <main class="cv-share">
      <div class="cv-share__stage" data-cv-stage></div>
    </main>

    <!-- The CV as the editor saved it. The JSON_HEX_ flags turn < > & ' " into
         codes, so text in the CV can never close this script tag. -->
    <script type="application/json" id="cvContent"><?= json_encode($content, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE) ?></script>
    <script src="js/translate.js?v=<?= ASSET_VERSION ?>"></script>
    <script src="js/cv-render.js?v=<?= ASSET_VERSION ?>"></script>
    <script>
      (function () {
        var stage = document.querySelector("[data-cv-stage]");
        var content = JSON.parse(document.querySelector("#cvContent").textContent);
        var cv = FolioRender.page(content);
        stage.appendChild(cv);

        // Scale the A4 page to the screen; the stage gets the page's height.
        function fit() {
          FolioRender.fit(stage);
          stage.style.height = Math.ceil(cv.offsetHeight * stage.clientWidth / cv.offsetWidth) + "px";
        }
        fit();
        window.addEventListener("resize", fit);
        if (document.fonts) document.fonts.ready.then(fit);
      })();
    </script>
<?php else: ?>
    <main class="cv-share cv-share--missing">
      <h1><?= $failed ? 'Dit cv kan nu niet worden geladen' : 'Dit cv is niet (meer) te zien' ?></h1>
      <p><?= $failed ? 'Probeer het over een paar minuten opnieuw.' : 'De link klopt niet, of de eigenaar deelt dit cv niet meer.' ?></p>
    </main>
    <script src="js/translate.js?v=<?= ASSET_VERSION ?>"></script>
<?php endif; ?>
  </body>
</html>
