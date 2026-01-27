# NGINX

> NGINX is king in the world of web servers. It is a high-performance HTTP server, reverse proxy, and know for its ability to handle a large number of concurrent connections with low resource consumption. \
> NGINX is often used for serving static content, load balancing, and as a reverse proxy for applications.

- [NGINX](#nginx)
  - [Key Features](#key-features)
  - [Overview](#overview)
  - [Configuration Structure](#configuration-structure)
  - [NGINX Modules](#nginx-modules)
    - [1. ngx_core_module (Main Core)](#1-ngx_core_module-main-core)
    - [2. ngx_http_core_module (HTTP Core)](#2-ngx_http_core_module-http-core)
      - [Embedded Variables](#embedded-variables)
    - [3. ngx_upstream_module (Load Balancing)](#3-ngx_upstream_module-load-balancing)
    - [4. `ngx_http_auth_request_module` (HTTP Authentication)](#4-ngx_http_auth_request_module-http-authentication)
    - [5. `ngx_http_ssl_module` (SSL/TLS Support)](#5-ngx_http_ssl_module-ssltls-support)
    - [6. `ngx_http_rewrite_module` (URL Rewriting)](#6-ngx_http_rewrite_module-url-rewriting)
    - [7. `ngx_http_proxy_module` (HTTP Proxying)](#7-ngx_http_proxy_module-http-proxying)

## Key Features

- **High Performance**: NGINX is designed to handle a large number of simultaneous connections efficiently, making it ideal for high-traffic websites.
- **Reverse Proxy**: NGINX can act as a reverse proxy server, distributing incoming requests to multiple backend servers to balance the load.
- **Load Balancing**: NGINX supports various load balancing algorithms, including round-robin, least connections, and IP hash.
- **Static Content Serving**: NGINX excels at serving static files quickly and efficiently.
- **SSL/TLS Termination**: NGINX can handle SSL/TLS encryption and decryption, offloading this task from backend servers.
- **Modular Architecture**: NGINX has a modular architecture that allows for easy customization and extension through third-party modules.
- **Configuration Flexibility**: NGINX uses a simple and flexible configuration syntax, making it easy to set up and manage.
- **Caching**: NGINX includes built-in caching capabilities to improve performance by storing frequently accessed content.
- **Security Features**: NGINX includes various security features, such as rate limiting, access control, and request filtering.

## Overview

1. **Workers**: NGINX uses a master-worker architecture where the master process manage read, configuration, and worker allocation/termination. Worker processes handle the actual client requests.
2. **Signals**: NGINX uses Unix singles to control the master process, allowing for actions like reloading configuration or shutting down gracefully.
   1. `nginx -s reload`: Reloads the configuration without stopping the server, send old workers to finish their requests before shuting down and starting new workers with the new configuration.
   2. `nginx -s stop`: Stops the server immediately, terminating all worker processes.
   3. `nginx -s quit`: Gracefully shuts down the server, allowing workers to finish processing current requests before exiting.
3. **Configuration Files**: NGINX configuration files are typically located in `/etc/nginx/`, [for more see](#configuration-structure).

## Configuration Structure

- NGINX configuration consists directives specified in configuration files directives divided into two main types:
  - **Simple Directives**: These directives consist of a single line and end with a semicolon (`;`). They define specific settings or parameters. Example:

    ```nginx
    worker_processes  1; # This directive sets the number of worker processes

    server {
        listen       80; # This is a simple directive
        server_name  example.com; # Another simple directive
    }

    http {
        include       mime.types; # Simple directive to include MIME types
        default_type  application/octet-stream; # Simple directive to set default MIME type
    }
    ```

  - **Block Directives**: These directives contain multiple lines enclosed within curly braces (`{}`) and can include other directives. They define contexts or scopes for related settings. Example:

    ```nginx
    // This is a block directive defining a server context
    server {
        listen       80; # Simple directive inside the block
        server_name  example.com;

        location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
        }
    }
    ```

- [See Static Content Example](/examples/serving-static-contents/nginx.conf)
- [See Reverse Proxy Example](/examples/reverse-proxy/nginx.conf)

## NGINX Modules

- NGINX has a modular architecture that allows for easy customization and extension through built-in and third-party modules. These modules provide additional functionality and features to enhance NGINX's capabilities.

### 1. ngx_core_module (Main Core)

- The `ngx_core_module` is the main core module of NGINX that provides essential functionality for the server's operation. It is responsible for handling low-level tasks such as process management, event handling, and configuration parsing.

- Key directives provided by the `ngx_core_module` include:
  - `worker_processes`: Specifies the number of worker processes to be spawned by the NGINX master process.
    - "auto" can be used to automatically set the number of worker processes to the number of available CPU cores.
    - Example: `worker_processes auto; || worker_processes 4;`

  - `worker_connections`: Defines the maximum number of simultaneous connections that each worker process can handle.
    - `events { worker_connections 1024; }`: Sets the maximum number of simultaneous connections per worker process to 1024.
  - `daemon`: Controls whether NGINX runs as a daemon (in the background) or in the foreground.
    - Example: `daemon on;` (default) or `daemon off;`
  - `pid`: Specifies the file path where the NGINX master process ID (PID) is stored.
    - Example: `pid /var/run/nginx.pid;`
  - `error_log`: Configures the location and log level for error logging.
    - Example: `error_log /var/log/nginx/error.log warn;`

### 2. ngx_http_core_module (HTTP Core)

- The `ngx_http_core_module` is a core module of NGINX that provides essential functionality for handling HTTP requests and responses. It is responsible for processing incoming HTTP requests, routing them to the appropriate server blocks, and generating HTTP responses.

- Key directives provided by the `ngx_http_core_module` include:
  - `server`: Defines a virtual server that listens for incoming HTTP requests on specified IP addresses and ports.
    - Example:

      ```nginx
      server {
          listen 80; # This server listens on port 80
          server_name example.com; # Domain name the server responds to

          # Location block to handle requests
          location / {
              root /usr/share/nginx/html;
              index index.html index.htm;
          }
      }
      ```

  - `include`: Includes additional configuration files into the current configuration context.
    - Example: `include /etc/nginx/mime.types;` # Includes MIME types definitions

  - `location`: Defines how to process requests for specific URL patterns within a `server` block. It allows for routing and handling of different types of content or services based on the requested URI.
    - `location` can be used with various modifiers to specify matching behavior:
      - `=`: Exact match
      - `^~`: Prefix match with higher priority
      - `~`: Case-sensitive regular expression match
      - `~*`: Case-insensitive regular expression match
      - No modifier: Standard prefix match
    - Example:

      ```nginx
      location /api/ {
          # We can "on" or "off" various features here like caching, authentication, etc. Example:
          auth_request off; # Disable authentication for this location
          proxy_pass http://backend_server; # Forward requests to backend server
      }
      ```

    - How nginx routes requests:
      1. Exact match (`=`) takes the highest priority.
      2. Prefix match with `^~` is checked next.
      3. Regular expression matches (`~` and `~*`) are evaluated in the order they appear.
      4. Standard prefix matches are considered last.

  - `internal`: Marks a location as internal, meaning it can only be accessed by NGINX itself and not directly by clients.
    - Example: `location /internal/ { internal; }`

  - `root`: Specifies the root directory for serving static files for the matched URL pattern.
    - Example: `root /usr/share/nginx/html;`
  - `index`: Defines the default index files to be served when a directory is requested.
  - `try_files`: Attempts to serve files in a specified order, falling back to alternative options if the requested file is not found.
    - Example: `try_files $uri $uri/ =404;`
    - Example: `index index.html index.htm;`
  - `alias`: Specifies an alternative path for serving files, different from the root directory.
    - Example: `alias /var/www/images/;` # Maps the URL to the /var/www/images/ directory
  - `proxy_pass`: Used in reverse proxy configurations to forward requests to backend servers.
    - Example: `proxy_pass http://backend_server;`
  - `try_files`: Attempts to serve files in a specified order, falling back to alternative options if the requested file is not found.
    - Example: `try_files $uri $uri/ =404;`
  - `return`: Used to send HTTP redirects or custom responses for specific URL patterns.
    - Example: `return 301 /new-path;` # Permanent redirect to /new-path
    - Example: `return 404;` # Return a 404 Not Found response
  - `rewrite`: Used to modify the requested URI based on specified patterns and conditions.
    - Example: `rewrite ^/old-path/(.*)$ /new-path/$1 permanent;` # Redirect /old-path/_to /new-path/_
  - `client_max_body_size`: Sets the maximum allowed size of the client request body, useful for controlling file upload sizes.
    - Example: `client_max_body_size 10M;` # Sets the maximum request body size to 10 megabytes
  - `keepalive_timeout`: Configures the timeout for keep-alive connections between the client and server.
    - Example: `keepalive_timeout 65;` # Sets the keep-alive timeout to 65 seconds
  - `rate_limit`: Limits the rate of requests from clients to prevent abuse or overload.
    - Example: `limit_req_zone $binary_remote_addr zone=mylimit:10m rate=1r/s;` # Limits requests to 1 request per second per client IP
  - `gzip`: Enables or disables gzip compression for HTTP responses to reduce bandwidth usage.
    - Example: `gzip on;` # Enables gzip compression
  - `type`: Specifies the MIME type for files served by NGINX. Default types are defined in the `mime.types` file, but custom types can be added.
    - Example: `types { text/html html; application/json json; }`

#### Embedded Variables

- NGINX provides a set of embedded variables that can be used within configuration directives to access various request and server information. Some commonly used embedded variables include:
  - `$uri`: The normalized URI of the request.
  - `$request_method`: The HTTP method of the request (e.g., GET, POST).
  - `$remote_addr`: The IP address of the client making the request.
  - `$host`: The host header from the client request.
  - `$http_user_agent`: The User-Agent header from the client request.
  - `$status`: The HTTP status code of the response.
  - `$body_bytes_sent`: The number of bytes sent to the client in the response body.
  - `$request_time`: The total time taken to process the request.

### 3. ngx_upstream_module (Load Balancing)

- The `ngx_upstream_module` is a core module of NGINX that provides load balancing functionality for distributing incoming requests across multiple backend servers. It allows NGINX to act as a reverse proxy and efficiently manage traffic to backend services.

- Key directives provided by the `ngx_upstream_module` include:
  - `upstream`: Defines a group of backend servers that NGINX can distribute requests to. It allows for load balancing and failover configurations.
    - Example:

      ```nginx
      upstream backend_servers {
          server backend1.example.com;
          server backend2.example.com;
          server backend3.example.com;
      }
      ```

  - `proxy_pass`: Used in conjunction with the `upstream` directive to forward requests to the defined backend server group.
    - Example: `proxy_pass http://backend_servers;`

  - Algorithms for load balancing:
    - `round_robin` (default): Distributes requests evenly across all backend servers in a circular manner.
    - `least_conn`: Directs requests to the backend server with the fewest active connections.
    - `ip_hash`: Routes requests based on the client's IP address, ensuring that requests from the same client are consistently sent to the same backend server.

  - `server`: Specifies a backend server within an `upstream` block. Multiple `server` directives can be defined to create a pool of backend servers.
    - Example: `server backend1.example.com;`

  - `weight`: Assigns a weight to a backend server, influencing the distribution of requests. Servers with higher weights receive more requests.
    - Example: `server backend1.example.com weight=3;` # This server will receive more requests compared to others with lower weights

  - `max_fails`: Sets the maximum number of failed attempts to connect to a backend server before it is considered unavailable.
    - Example: `server backend1.example.com max_fails=2;` # After 2 failed attempts, the server is marked as unavailable
  - `fail_timeout`: Specifies the time period during which a backend server is considered unavailable after reaching the maximum number of failures.
    - Example: `server backend1.example.com fail_timeout=30s;` # The server will be marked as unavailable for 30 seconds after max_fails is reached
  - `keepalive`: Configures the number of idle keep-alive connections to maintain with backend servers, improving performance by reusing connections.
    - Example: `upstream backend_servers { keepalive 16; ... }` # Maintains up to 16 idle keep-alive connections

### 4. `ngx_http_auth_request_module` (HTTP Authentication)

- The `ngx_http_auth_request_module` is a core module of NGINX that provides HTTP authentication functionality. It allows NGINX to delegate authentication requests to an external authentication server or service, enabling flexible and customizable authentication mechanisms.

- Key directives provided by the `ngx_http_auth_request_module` include:
  - `auth_request`: Specifies a subrequest to an external authentication server to validate client requests. The subrequest is made to the specified URI, and the response determines whether the client request is allowed or denied.
    - Example:

      ```nginx
      location /protected/ {
          auth_request /auth; # Subrequest to /auth for authentication
          proxy_pass http://backend_server; # Forward authenticated requests to backend server
      }

      location = /auth {
          internal; # Marks this location as internal
          proxy_pass http://auth
      ```

### 5. `ngx_http_ssl_module` (SSL/TLS Support)

- The `ngx_http_ssl_module` is a core module of NGINX that provides SSL/TLS support for secure communication over HTTPS. It allows NGINX to handle encrypted connections, ensuring data confidentiality and integrity between clients and the server.

- Key directives provided by the `ngx_http_ssl_module` include:
  - `ssl_certificate`: Specifies the path to the SSL/TLS certificate file used for encrypting communications.
    - Example: `ssl_certificate /etc/nginx/ssl/server.crt;`
  - `ssl_certificate_key`: Specifies the path to the private key file associated with the SSL/TLS certificate.
    - Example: `ssl_certificate_key /etc/nginx/ssl/server.key;`
  - `ssl_protocols`: Defines the SSL/TLS protocols that NGINX will support for secure connections.
    - Example: `ssl_protocols TLSv1.2 TLSv1.3;` # Supports TLS versions 1.2 and 1.3
  - `ssl_ciphers`: Specifies the list of SSL/TLS ciphers that NGINX will use for encrypting communications.
    - Example: `ssl_ciphers HIGH:!aNULL:!MD5;` # Uses high-security ciphers while excluding weak ones
  - `ssl_prefer_server_ciphers`: Controls whether NGINX should prefer its own cipher order over the client's preferences.
    - Example: `ssl_prefer_server_ciphers on;` # NGINX will use its own cipher order

  - Example:

    ```nginx
    server {
        listen 443 ssl; # Listen on port 443 for HTTPS connections
        server_name example.com;

        ssl_certificate /etc/nginx/ssl/server.crt; # Path to SSL certificate
        ssl_certificate_key /etc/nginx/ssl/server.key; # Path to SSL certificate key

        location / {
            root /usr/share/nginx/html;
            index index.html index.htm;
        }
    }
    ```

### 6. `ngx_http_rewrite_module` (URL Rewriting)

- The `ngx_http_rewrite_module` is a core module of NGINX that provides URL rewriting functionality. It allows NGINX to modify incoming request URIs based on specified patterns and conditions, enabling flexible routing and redirection of requests.

- Key directives provided by the `ngx_http_rewrite_module` include:
  - `rewrite`: Modifies the requested URI based on specified patterns and conditions. It can be used for URL redirection or rewriting.
    - Example:

      ```nginx
      location /old-path/ {
          rewrite ^/old-path/(.*)$ /new-path/$1 permanent; # Redirect /old-path/_ to /new-path/_
      }
      ```

  - `if`: Defines conditional statements that allow for executing specific actions based on certain conditions.
    - Example:

      ```nginx
      location / {
          if ($http_user_agent ~* "MSIE") {
              return 403; # Deny access for Internet Explorer users
          }
      }
      ```

  - `set`: Assigns values to variables that can be used in other directives or conditions.
    - Example: `set $my_var "some_value";` # Assigns the value "some_value" to the variable $my_var

  - `return`: Sends HTTP redirects or custom responses based on specified conditions.
    - Example: `return 301 /new-path;` # Permanent redirect to /new-path
    - Example: `return 404;` # Return a 404 Not Found response

  - `break`: Stops further processing of rewrite directives and continues with the request handling.
    - Example:

      ```nginx
      location /example/ {
          rewrite ^/example/(.*)$ /new-example/$1 break; # Stop processing further rewrites
      }
      ```

### 7. `ngx_http_proxy_module` (HTTP Proxying)

- The `ngx_http_proxy_module` is a core module of NGINX that provides HTTP proxying functionality. It allows NGINX to act as a reverse proxy server, forwarding client requests to backend servers and relaying their responses back to the clients.

- Key directives provided by the `ngx_http_proxy_module` include:
  - `proxy_pass`: Forwards client requests to a specified backend server or upstream group.
    - Example:

      ```nginx
      location /api/ {
          proxy_pass http://backend_server; # Forward requests to backend server
      }
      ```

  - `proxy_set_body`: Sets or modifies the body of the proxied request sent to the backend server.
    - Example: `proxy_set_body $request_body;` # Sets the request body to the value of the $request_body variable

  - `proxy_set_header`: Sets or modifies HTTP headers in the proxied request sent to the backend server.
    - Example: `proxy_set_header Host $host;` # Sets the Host header to the value of the $host variable

  - `proxy_redirect`: Modifies the "Location" and "Refresh" headers in the response from the backend server.
    - Example: `proxy_redirect http://backend_server/ /;` # Redirects backend server responses to the root path

  - `proxy_buffering`: Controls whether response buffering is enabled or disabled for proxied requests.
    - Example: `proxy_buffering on;` # Enables response buffering

  - `proxy_connect_timeout`: Sets the timeout for establishing a connection to the backend server.
    - Example: `proxy_connect_timeout 30s;` # Sets the connection timeout to 30 seconds

  - `proxy_read_timeout`: Sets the timeout for reading a response from the backend server.
    - Example: `proxy_read_timeout 60s;` # Sets the read timeout to 60 seconds
