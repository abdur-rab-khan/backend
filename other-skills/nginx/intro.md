# NGINX

> NGINX is king in the world of web servers. It is a high-performance HTTP server, reverse proxy, and know for its ability to handle a large number of concurrent connections with low resource consumption. \
> NGINX is often used for serving static content, load balancing, and as a reverse proxy for applications.

- [NGINX](#nginx)
  - [Key Features](#key-features)
  - [Overview](#overview)
  - [Configuration Structure](#configuration-structure)
  - [Nginx different blocks and directives](#nginx-different-blocks-and-directives)
    - [1. Main Block](#1-main-block)

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

## Nginx different blocks and directives

### 1. Main Block

- The main block is the top-level context in the NGINX configuration file. It contains global settings that apply to the entire NGINX server.
- Common directives in the main block include:
  - `worker_processes`:
    - Specifies the number of worker processes to be spawned by the NGINX master process. This setting is crucial for optimizing performance based on the server's CPU cores.
    - "auto" can be used to automatically set the number of worker processes to the number of available CPU cores.
    - Example: `worker_processes auto; || worker_processes 4;`

  - `events`:
    - Defines settings related to event handling, such as the maximum number of simultaneous connections that each worker process can handle or the event model to be used.
    - Example:

      ```nginx
      events {
          # Sets the maximum number of simultaneous connections per worker process
          worker_connections 1024;

          # Enables multi_accept to allow a worker process to accept multiple new connections at once
          multi_accept on;
      }
      ```

  - `http`:
    - This block contains directives related to HTTP server configuration, including settings for handling HTTP requests, defining server blocks, and configuring modules like gzip compression, caching, and logging.
    - Some common directives within the `http` block include:
      - `include`: Used to include additional configuration files, such as MIME types or virtual host configurations, allowing for modular and organized configuration management.
      - `server`: Defines a virtual server that listens for incoming HTTP requests on specified IP addresses and ports.
      - `log_format` and `access_log`: Configure logging formats and specify log file locations for HTTP requests.
      - `gzip`: Enables or disables gzip compression for HTTP responses to reduce bandwidth usage.
      - `upstream`: Defines a group of backend servers for load balancing and reverse proxying.
  - `server`:
    - This block defines a virtual server that listens for incoming HTTP requests on specified IP addresses and ports. Each `server` block can contain multiple `location` blocks to handle different URL patterns.
    - Common directives within the `server` block include:
      - `listen`: Specifies the IP address and port on which the server listens for incoming requests.
      - `server_name`: Defines the domain names or IP addresses that the server responds to.
      - `location`: Defines how to process requests for specific URL patterns, allowing for routing and handling of different types of content or services.
      - `root` and `index`: Specify the root directory for serving static files and the default index files to be served when a directory is requested.
      - `proxy_pass`: Used in reverse proxy configurations to forward requests to backend servers.
      - `error_page`: Configures custom error pages for specific HTTP status codes.
      - `ssl_certificate` and `ssl_certificate_key`: Specify the SSL/TLS certificate and private key files for enabling HTTPS on the server.
    - Example:

      ```nginx
      server {
          listen 443 ssl [instead of 80]; # Upcoming requests are hit on port 80
          server_name example.com www.example.com; # Domain names the server responds to

          location / {
              root /usr/share/nginx/html;
              index index.html index.htm;
          }

          # Enable SSL/TLS for secure connections (HTTPS)
          ssl_certificate /path/to/certificate.crt;
          ssl_certificate_key /path/to/private.key;

          location /api/ {
              proxy_pass http://backend_server; # Forward requests to backend server
          }
      }
      ```

    - `upstream`:
      - This block defines a group of backend servers for load balancing and reverse proxying. It allows NGINX to distribute incoming requests across multiple backend servers to improve performance and reliability.
      - Common directives within the `upstream` block include:
        - `server`: Specifies the address and port of each backend server in the upstream group.
        - Load balancing methods such as `least_conn`, `ip_hash`, or `weight` can be used to control how requests are distributed among the backend servers.
      - Example:

        ```nginx
        upstream backend_servers {
            [least_conn, ip_hash, wight=2, ...] # Default is round-robin
            server backend1.example.com:8080;
            server backend2.example.com:8080;
            server backend3.example.com:8080;
        }

        server {
            listen 80;

            location /api/ {
                proxy_pass http://backend_servers; # Forward requests to the upstream group
            }
        }
        ```

    - `location`:
      - This block defines how to process requests for specific URL patterns within a `server` block. It allows for routing and handling of different types of content or services based on the requested URI.
      - Common directives within the `location` block include:
        - `root`: Specifies the root directory for serving static files for the matched URL pattern.
        - `index`: Defines the default index files to be served when a directory is requested.
        - `proxy_pass`: Used in reverse proxy configurations to forward requests to backend servers.
        - `try_files`: Attempts to serve files in a specified order, falling back to alternative options if the requested file is not found.
        - `return`: Used to send HTTP redirects or custom responses for specific URL patterns.
          - `return 301 /new-path;` # Permanent redirect to /new-path
          - `return 404;` # Return a 404 Not Found response
        - `rewrite`: Used to modify the requested URI based on specified patterns and conditions.
          - `rewrite ^/old-path/(.*)$ /new-path/$1 permanent;` # Redirect /old-path/_ to /new-path/_
      - Example:

        ```nginx
        server {
            listen 80;

            location / {
                root /usr/share/nginx/html;
                index index.html;
            }

            location /api/ {
                proxy_pass http://backend_server; # Forward requests to backend server
            }
        }
        ```

      - Nginx provides some build-in that can be used within location blocks:
        - `$uri`: The normalized URI of the request. Example: `/api/users`
        - `$request_uri`: The original request URI as sent by the client. Example: `/api/users?id=1`
        - `$request_method`: The HTTP method. Example: `GET`, `POST`
        - `$remote_addr`: Client IP address. Example: `192.168.1.1`
        - `$host`: The host header. Example: `example.com`
        - `$args`: Query string arguments. Example: `id=1&name=test`
        - `$http_user_agent`: User-Agent header. Example: `Mozilla/5.0...`
        - `$http_referer`: Referer header. Example: `https://google.com`
        - `$http_cookie`: Cookie header value.
        - `$server_name`: Server name from config. Example: `example.com`
        - `$server_port`: Listening port. Example: `80`, `443`
        - `$scheme`: Request scheme. Example: `http`, `https`
        - `$status`: Response status code. Example: `200`, `404`

        ```nginx
        # Usage example
        location /api/ {
            # Log client info
            add_header X-Client-IP $remote_addr;

            # Redirect HTTP to HTTPS
            if ($scheme = http) {
                return 301 https://$host$request_uri;
            }
        }
        ```
