<?php
/**
 * Configuración CORS para VinylStation
 * Añadir este código al archivo functions.php del tema de WordPress
 * o crear un plugin personalizado
 */

// Permitir CORS para GraphQL
add_action('graphql_init', function() {
    // Dominios permitidos
    $allowed_origins = [
        'http://localhost:3000',
        'https://localhost:3000',
        'https://2e43605e.vinylstation.pages.dev',
        'https://vinylstation.pages.dev',
        'https://demo.vinylstation.es',
        'https://vinylstation.es',
        'https://www.vinylstation.es'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }
});

// Permitir CORS para la API REST
add_action('rest_api_init', function() {
    // Dominios permitidos
    $allowed_origins = [
        'http://localhost:3000',
        'https://localhost:3000',
        'https://2e43605e.vinylstation.pages.dev',
        'https://vinylstation.pages.dev',
        'https://demo.vinylstation.es',
        'https://vinylstation.es',
        'https://www.vinylstation.es'
    ];
    
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
    }
});

// Manejar peticiones OPTIONS (preflight)
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $allowed_origins = [
            'http://localhost:3000',
            'https://localhost:3000',
            'https://2e43605e.vinylstation.pages.dev',
            'https://vinylstation.pages.dev',
            'https://demo.vinylstation.es',
            'https://vinylstation.es',
            'https://www.vinylstation.es'
        ];
        
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: $origin");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type, Authorization");
            header("Access-Control-Max-Age: 3600");
        }
        
        exit(0);
    }
});
