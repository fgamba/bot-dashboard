<?php
/**
 * Plugin Name: Fortress Bot API
 * Description: Endpoints REST Headless para el dashboard del bot Fortress Mode.
 * Version: 1.0
 * Author: Fernando Gamba
 */

if ( ! defined( 'ABSPATH' ) ) exit; // Bloqueo de acceso directo

class Fortress_Bot_API {

    public function __construct() {
        // Enganchamos nuestra función para registrar las rutas en la inicialización de la API REST
        add_action( 'rest_api_init', [ $this, 'register_endpoints' ] );
    }

    public function register_endpoints() {
        // ENDPOINT GET: El frontend en React consumirá esto para dibujar la pantalla
        // URL: tusitio.com/wp-json/fortress/v1/status
        register_rest_route( 'fortress/v1', '/status', [
            'methods'  => 'GET',
            'callback' => [ $this, 'get_status' ],
            'permission_callback' => '__return_true' // Público por ahora para facilitar el desarrollo
        ] );

        // ENDPOINT POST: Tu bot de Python enviará los datos frescos acá
        register_rest_route( 'fortress/v1', '/status', [
            'methods'  => 'POST',
            'callback' => [ $this, 'update_status' ],
            'permission_callback' => '__return_true' // Luego le pondremos un API Key
        ] );
    }

    // Devuelve el estado actual a React
    public function get_status( $request ) {
        // Buscamos los datos guardados en la tabla wp_options
        $status = get_option( 'fortress_bot_status' );
        
        // Si no hay datos (la primera vez), devolvemos datos dummy para que puedas ir diseñando el frontend
        if ( ! $status ) {
            $status = [
                'balance' => 1740.23,
                'drawdown' => 0.5,
                'regime' => 'NEUTRAL/GREED',
                'fng' => 50,
                'last_update' => current_time('mysql')
            ];
        }

        return new WP_REST_Response( $status, 200 );
    }

    // Guarda los datos que envía el bot de Python
    public function update_status( $request ) {
        // Extrae el JSON enviado por Python
        $params = $request->get_json_params();
        
        if ( empty( $params ) ) {
            return new WP_Error( 'no_data', 'No se enviaron datos válidos', [ 'status' => 400 ] );
        }

        // Le estampamos la hora del servidor de WordPress
        $params['last_update'] = current_time('mysql');
        
        // Guardamos todo el objeto JSON en la base de datos de WP
        update_option( 'fortress_bot_status', $params );

        return new WP_REST_Response( [ 'success' => true, 'message' => 'Status actualizado correctamente' ], 200 );
    }
}

// Inicializamos la clase
new Fortress_Bot_API();
