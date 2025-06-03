<?php
/**
 * Funciones básicas del tema simplificado VinylStation
 */

// Configuración básica del tema
function vinylstation_setup() {
    // Habilitar características esenciales de WordPress
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    // Registrar menús
    register_nav_menus(array(
        'primary' => 'Menú Principal',
        'footer' => 'Menú Pie de Página',
    ));
}
add_action('after_setup_theme', 'vinylstation_setup');

// Enqueue estilos y scripts
function vinylstation_enqueue_assets() {
    // Estilos principales del tema
    wp_enqueue_style('vinylstation-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Scripts principales (solo si existe el archivo)
    if (file_exists(get_template_directory() . '/assets/js/main.js')) {
        wp_enqueue_script('vinylstation-script', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'vinylstation_enqueue_assets');

// Incluir archivos de funcionalidad si existen
$files_to_include = array(
    // Tipos de contenido personalizados - ahora manejados por el plugin
    'inc/cpt.php',
    
    // Campos ACF - solo si es necesario
    'inc/acf.php',
    
    // Soporte para REST API - solo si es necesario
    'inc/rest.php',
);

foreach ($files_to_include as $file) {
    if (file_exists(get_template_directory() . '/' . $file)) {
        require_once get_template_directory() . '/' . $file;
    }
}

// Opciones del sitio para ACF (permite exponer campos globales como el logo)
if( function_exists('acf_add_options_page') ) {
    acf_add_options_page([
        'page_title'  => 'Opciones del sitio',
        'menu_title'  => 'Opciones del sitio',
        'menu_slug'   => 'site-options',
        'capability'  => 'edit_posts',
        'redirect'    => false
    ]);
}

// Aumentar el límite máximo de resultados en WPGraphQL
add_filter( 'graphql_connection_max_query_amount', function( $max ) {
    return 500; // Cambia 200 por el límite que quieras
});

// ========================================
// CONFIGURACIÓN CORS MEJORADA PARA VINYLSTATION
// ========================================
add_action('init', function() {
    // Lista de dominios permitidos
    $allowed_origins = [
        'https://cb97ed2a.vinylstation.pages.dev',  // Dominio actual de Cloudflare
        'https://0714c004.vinylstation.pages.dev',  // Dominio anterior (mantener por compatibilidad)
        'https://vinylstation.pages.dev',            // Dominio personalizado
        'https://vinylstation.com',                  // Dominio principal
        'https://demo.vinylstation.es',              // Dominio demo
        'https://www.vinylstation.com',              // Con www
        'http://localhost:3000',                     // Desarrollo local
        'http://localhost:4321',                     // Astro dev server
    ];
    
    // Obtener el origen de la request
    $origin = '';
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        $origin = $_SERVER['HTTP_ORIGIN'];
    } elseif (isset($_SERVER['HTTP_REFERER'])) {
        $parsed = parse_url($_SERVER['HTTP_REFERER']);
        $origin = $parsed['scheme'] . '://' . $parsed['host'];
    }
    
    // Verificar si el origen está permitido
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }
    
    // Headers CORS estándar
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma");
    
    // Manejar requests OPTIONS (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header("Access-Control-Max-Age: 86400"); // Cache preflight por 24 horas
        status_header(200);
        exit();
    }
}, 1); // Prioridad alta para ejecutar temprano

// ========================================
// CONFIGURACIÓN ESPECÍFICA PARA WPGRAPHQL
// ========================================

// Asegurar CORS para WPGraphQL
add_filter('graphql_cors_allowed_domains', function($allowed_domains) {
    $domains = [
        'cb97ed2a.vinylstation.pages.dev',
        '0714c004.vinylstation.pages.dev',
        'vinylstation.pages.dev',
        'vinylstation.com',
        'demo.vinylstation.es',
        'www.vinylstation.com',
        'localhost:3000',
        'localhost:4321'
    ];
    
    return array_merge($allowed_domains, $domains);
});

// Permitir queries más grandes para obtener todos los vinilos
add_filter( 'graphql_connection_max_query_amount', function( $max ) {
    return 1000; // Aumentado para permitir cargar todos los vinilos
});

// Habilitar introspección de GraphQL en producción (opcional)
add_filter( 'graphql_show_in_graphiql', '__return_true' );

// ========================================
// CONFIGURACIÓN ADICIONAL PARA REST API
// ========================================

// Permitir CORS también para REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        $allowed_origins = [
            'https://cb97ed2a.vinylstation.pages.dev',
            'https://0714c004.vinylstation.pages.dev',
            'https://vinylstation.pages.dev',
            'https://vinylstation.com',
            'https://demo.vinylstation.es',
            'https://www.vinylstation.com',
            'http://localhost:3000',
            'http://localhost:4321',
        ];
        
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Credentials: true");
        }
        
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");
        
        return $value;
    });
});

// ========================================
// LOGGING PARA DEBUGGING (OPCIONAL)
// ========================================

// Función para log de debugging CORS (descomenta si necesitas debuggear)
/*
function vinylstation_log_cors_request() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : 'No origin';
    $method = $_SERVER['REQUEST_METHOD'];
    $uri = $_SERVER['REQUEST_URI'];
    
    error_log("CORS Request - Origin: $origin, Method: $method, URI: $uri");
}
add_action('init', 'vinylstation_log_cors_request');
*/

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

// Función para verificar si una request viene de un dominio permitido
function vinylstation_is_allowed_origin($origin = null) {
    if (!$origin) {
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    }
    
    $allowed_origins = [
        'https://cb97ed2a.vinylstation.pages.dev',
        'https://0714c004.vinylstation.pages.dev',
        'https://vinylstation.pages.dev',
        'https://vinylstation.com',
        'https://demo.vinylstation.es',
        'https://www.vinylstation.com'
    ];
    
    return in_array($origin, $allowed_origins);
}

?>