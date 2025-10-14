# `CURL`

> `curl` is a command-line tool for transferring data from or to a server, using various protocols such as HTTP, HTTPS, FTP, and more.
> It is widely used for testing APIs, downloading files, and interacting with web services.

- [`CURL`](#curl)
  - [Basic Usage](#basic-usage)
  - [Important Note](#important-note)
    - [1. Globbing](#1-globbing)
      - [Example of globbing](#example-of-globbing)
    - [2. Variables](#2-variables)
      - [Example of variables](#example-of-variables)
    - [3. Output](#3-output)
      - [Example of output](#example-of-output)
  - [Used Options](#used-options)
    - [1. `-X`, `--request <command>`](#1--x---request-command)
      - [Example of request](#example-of-request)
    - [2. `-H`, `--header <header/@file>`](#2--h---header-headerfile)
      - [Example of header](#example-of-header)
      - [`@-` Symbol](#--symbol)
      - [`-D, --dump-header <file>`](#-d---dump-header-file)
    - [3. Methods of sending data](#3-methods-of-sending-data)
      - [1. `-d, --data <data>`](#1--d---data-data)
        - [Example of data](#example-of-data)
      - [2. `--json <data/file>`](#2---json-datafile)
        - [Example of json](#example-of-json)
      - [3. `-T, --upload-file <file>`](#3--t---upload-file-file)
        - [Example of upload-file](#example-of-upload-file)
      - [4. `-F, --form <name=content>`](#4--f---form-namecontent)
        - [Example of form](#example-of-form)
    - [4. `--url <url/file>`](#4---url-urlfile)
      - [Example of url](#example-of-url)
    - [3. `--url-query <data>`](#3---url-query-data)
      - [Example of url-query](#example-of-url-query)
    - [6. `-Z, --parallel`](#6--z---parallel)
      - [Example of parallel](#example-of-parallel)
    - [7. `-b, --cookie <data/file>`](#7--b---cookie-datafile)
      - [7.1. `-c, --cookie-jar <file>`](#71--c---cookie-jar-file)
      - [Example of cookie](#example-of-cookie)
    - [8. `-w, --write-out <format>`](#8--w---write-out-format)
      - [Example of write-out](#example-of-write-out)
    - [9. `-v, --verbose`](#9--v---verbose)
      - [Example of verbose](#example-of-verbose)
    - [10. `--compressed`](#10---compressed)
      - [Example of compressed](#example-of-compressed)
    - [11. `-K, --config <file>`](#11--k---config-file)
      - [Example of config file](#example-of-config-file)
  - [Others](#others)

## Basic Usage

```bash
curl [options] [URL...]
```

- Here

  - `options`: Various flags and parameters to customize the request (e.g., `-X` for specifying the request method (**GET**, **POST**, **PUT**, **DELETE**), `-H` for adding headers, `-d` for sending data).
  - `URL`: The target URL to which the request is sent.

- Example: Sending a GET request to fetch data from an API endpoint

  ```bash
    curl -X GET "https://api.example.com/data" -H "Authorization
  : Bearer YOUR_API_KEY"
  ```

## Important Note

### 1. Globbing

- Globbing lets you request multiple URLs with one command using special patterns.
- Use `-g` or `--globoff` to disable this feature.

**Pattern Types:**

1. `{}` - List of options: `file{1,2,3}.txt` → `file1.txt`, `file2.txt`, `file3.txt`
2. `[]` - Range of values: `file[1-3].txt` → `file1.txt`, `file2.txt`, `file3.txt`
3. `:` - Step value: `[1-10:2]` skips by 2 (1, 3, 5, 7, 9)

**How it works:** Patterns expand from outermost to innermost.

#### Example of globbing

```bash
# Basic range
curl "http://example.com/file[1-3].txt"
# Fetches: file1.txt, file2.txt, file3.txt

# Basic list
curl "http://example.com/site.{one,two,three}.txt"
# Fetches: site.one.txt, site.two.txt, site.three.txt

# Disable globbing (fetch literal URL)
curl -g "http://example.com/file[1-3].txt"

# Nested patterns
curl "http://example.com/archive[1996-1999]/vol[1-4]/part{a,b,c}.html"
# Fetches: archive1996/vol1/parta.html, archive1996/vol1/partb.html,
#          archive1996/vol1/partc.html, archive1996/vol2/parta.html, ...
# (All combinations: 4 years × 4 volumes × 3 parts = 48 URLs)

# Step values
curl "http://example.com/file[1-100:10].txt"
# Fetches: file1.txt, file11.txt, file21.txt, ..., file91.txt

curl "http://example.com/file[a-z:2].txt"
# Fetches: filea.txt, filec.txt, filee.txt, ..., filey.txt
```

### 2. Variables

- Curl supports variables (new feature) to reuse values in your commands.
- Set variables using `--variable name=value` or `--variable name@filename` to read from a file.
- Use variables in URLs, headers, and data by wrapping them in `{{variableName}}` with `--expand-` options.
- Access environment variables with `%name` syntax. Set defaults with `--variable %name=default` if not found.

#### Example of variables

**Using environment variable:**

```bash
curl --variable '%USER' --expand-url 'https://api.example.com/users/{{USER}}/data'
```

**Using custom variables:**

```bash
curl \
  --variable name=abdurrab \
  --expand-variable 'fix={{name}}_khan' \
  --expand-url "http://localhost:3000?x={{fix}}"
```

This expands to: `http://localhost:3000?x=abdurrab_khan`

**Note:** You can use `--expand-variable` and `--expand-url` multiple times to expand variables in different places.

### 3. Output

- By default, curl prints response to terminal.
- Save output to file: `-o <filename>` or `--output <filename>`
- Save with original filename from URL: `-O` or `--remote-name`
- Save in specific folder: `--output-dir <directory>`
- Use server's filename from header: `-J` or `--remote-header-name`
- With globbing, use `#1`, `#2`, etc. in filename to insert matched pattern parts.

**Common patterns:**

| Pattern            | Description            | Example                                         |
| ------------------ | ---------------------- | ----------------------------------------------- |
| `-o file`          | Save to specific file  | `-o result.html`                                |
| `-O`               | Use URL's filename     | `-O` (saves as `index.html` from `/index.html`) |
| `--output-dir dir` | Save in directory      | `--output-dir downloads`                        |
| `--create-dirs`    | Create dirs if needed  | `--create-dir data/files`                       |
| `-J`               | Use server's filename  | `-J -O`                                         |
| `-o "#1"`          | Use glob match in name | `-o "page#1.html"`                              |

#### Example of output

```bash
# Save single file
curl -o page.html https://example.com

# Use original filename from URL
curl -O https://example.com/document.pdf

# Save multiple URLs with globbing
curl "https://example.com/file[1-3].txt" -o "download#1.txt"
# Saves: download1.txt, download2.txt, download3.txt

# Save in specific directory
curl -O --output-dir downloads https://example.com/file.pdf

# Multiple URLs to different files (order matters)
curl example.com example.net -o aa.html -o bb.html

# Use server's suggested filename
curl -J -O https://example.com/download

# Complex globbing with multiple patterns
curl "http://{site,host}.host[1-3].com" -o "#1_#2.html"
# Saves: site_1.html, site_2.html, site_3.html, host_1.html, host_2.html, host_3.html
# #1 = first pattern (site/host), #2 = second pattern (1/2/3)

# Real example with multiple paths
curl "https://example.com/{about,contact,blog}/" -o "#1.html" --output-dir pages
# Saves in 'pages' folder: about.html, contact.html, blog.html
```

**Important:** When using multiple `-o` flags with multiple URLs, they match in order (first URL → first `-o`, second URL → second `-o`).
**Quick Tips:** Use `--out-null` to discard output (like `/dev/null`).

## Used Options

### 1. `-X`, `--request <command>`

- Specifies the HTTP request method or protocol command.
- Default is `GET` for HTTP (or `HEAD` if used with `-I`).

**HTTP Methods:**

| Method    | Purpose                    |
| --------- | -------------------------- |
| `GET`     | Fetch data (default)       |
| `POST`    | Send/create data           |
| `PUT`     | Update/replace resource    |
| `PATCH`   | Partial update             |
| `DELETE`  | Remove resource            |
| `HEAD`    | Get headers only (no body) |
| `OPTIONS` | Get supported methods      |

**FTP Commands:**

| Command | Purpose       |
| ------- | ------------- |
| `RETR`  | Download file |
| `STOR`  | Upload file   |
| `DELE`  | Delete file   |
| `LIST`  | List files    |

**SMTP Commands:**

| Command | Purpose         |
| ------- | --------------- |
| `MAIL`  | Start email     |
| `RCPT`  | Set recipient   |
| `DATA`  | Send email body |

**IMAP Commands:**

| Command  | Purpose      |
| -------- | ------------ |
| `SELECT` | Open mailbox |
| `FETCH`  | Get messages |
| `STORE`  | Update flags |

#### Example of request

```bash
# POST request with JSON data
curl -X POST "https://api.example.com/data" \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'

# PUT request to update resource
curl -X PUT "https://api.example.com/users/123" \
  -H "Content-Type: application/json" \
  -d '{"name":"John"}'

# DELETE request
curl -X DELETE "https://api.example.com/users/123"

# PATCH request for partial update
curl -X PATCH "https://api.example.com/users/123" \
  -d '{"status":"active"}'

# Get headers only (alternative to -I)
curl -X HEAD "https://api.example.com/status"

# OPTIONS request to see supported methods
curl -X OPTIONS "https://api.example.com/users"
```

**Quick tip:** Use `-I` or `--head` as shortcut for `HEAD` request instead of `-X HEAD`.

### 2. `-H`, `--header <header/@file>`

- Adds custom headers to HTTP, IMAP, or SMTP requests.
- Use multiple `-H` flags for multiple headers.
- curl automatically adds `Host:` and `User-Agent:` headers (you can override them).
- **Input methods:**
  - Direct string: `"Name: value"`
  - From file: `@filename`
  - From stdin: `@-`

**Common patterns:**

| Pattern            | Description           | Example                               |
| ------------------ | --------------------- | ------------------------------------- |
| `-H "Name: value"` | Add single header     | `-H "Content-Type: application/json"` |
| `-H "Name;"`       | Send empty header     | `-H "X-Custom-Header;"`               |
| `-H "Name:"`       | Remove default header | `-H "User-Agent:"`                    |
| `-H @file`         | Read from file        | `-H @headers.txt`                     |
| `-H @-`            | Read from stdin       | `echo "Auth: token" \| curl -H @-`    |

**Important notes:**

- To remove a header entirely, use `"Name:"` (with colon, no value).
- To send an empty header, use `"Name;"` (with semicolon).
- Headers from files should be one per line.

#### Example of header

```bash
# Single header
curl -H "Authorization: Bearer token123" https://api.example.com

# Multiple headers
curl -H "Content-Type: application/json" -H "Accept: application/json" https://api.example.com

# Override default header
curl -H "User-Agent: MyApp/1.0" https://api.example.com

# Remove default header
curl -H "User-Agent:" https://api.example.com

# Empty header value
curl -H "X-Custom-Header;" https://api.example.com

# Read from file (one header per line)
curl -H @headers.txt https://api.example.com

# Read from stdin (type headers, press Ctrl+D when done)
curl -H @- https://api.example.com

# Pipe headers from command
echo "Authorization: Bearer token123" | curl -H @- https://api.example.com

# Multiple headers from stdin
{
  echo "Authorization: Bearer token123"
  echo "Content-Type: application/json"
  echo "X-Custom-Header: value"
} | curl -H @- https://api.example.com
```

#### `@-` Symbol

- `@-` reads input from your keyboard (stdin) instead of a file.
- Useful for piping headers from other commands or scripts.
- Press `Ctrl+D` (Mac/Linux) or `Ctrl+Z` (Windows) to finish typing.

#### `-D, --dump-header <file>`

- Saves response headers to a file.
- Creates file if missing, overwrites if exists.
- Use `-` to write headers to stdout (terminal).
- Can be combined with `-o` to save body and headers separately.

### 3. Methods of sending data

#### 1. `-d, --data <data>`

- Sends data in HTTP POST requests (or PUT/PATCH with `-X`).
- Default `Content-Type`: `application/x-www-form-urlencoded`

**Input methods:**

| Method             | Description                 | Example                            |
| ------------------ | --------------------------- | ---------------------------------- |
| `"key=value"`      | Direct string               | `-d "name=John"`                   |
| `@file`            | Read from file              | `-d @data.txt`                     |
| `@-`               | Read from stdin             | `echo "name=John" \| curl -d @-`   |
| Multiple `-d`      | Multiple fields (auto `&`)  | `-d "name=John" -d "age=30"`       |
| `--data-raw`       | No special chars processing | `--data-raw "@file.txt"`           |
| `--data-binary`    | Keep newlines/binary data   | `--data-binary @file.bin`          |
| `--data-urlencode` | Auto URL-encode             | `--data-urlencode "name=John Doe"` |

**Special flags:**

- `--get`: Converts POST to GET (appends data as query params)
- `-X PUT`: Changes method to PUT instead of POST

##### Example of data

```bash
# Simple POST
curl -d "name=john&age=30" https://httpbin.org/post

# From file
curl -d @data.txt https://httpbin.org/post

# From stdin
echo "name=john" | curl -d @- https://httpbin.org/post

# Multiple fields
curl -d "name=john" -d "age=30" https://httpbin.org/post

# URL encode spaces
curl --data-urlencode "name=John Doe" https://httpbin.org/post

# Send as GET request
curl --get -d "search=term" https://example.com/api
```

**Quick tip:** Use `--data-raw "@text"` when your data contains literal `@` symbols.

#### 2. `--json <data/file>`

- Sends JSON data in HTTP POST requests (or PUT/PATCH with `-X`).
- Automatically sets `Content-Type: application/json` header.

**Input methods:**

| Method            | Description                           | Example                                        |
| ----------------- | ------------------------------------- | ---------------------------------------------- |
| `data`            | Direct JSON string                    | `--json '{"name":"John"}'`                     |
| `@file`           | Read JSON from file                   | `--json @data.json`                            |
| `@-`              | Read JSON from stdin                  | `echo '{"name":"John"}' \| curl --json @-`     |
| Multiple `--json` | Multiple JSON objects (last one used) | `--json '{"name":"John"}' --json '{"age":30}'` |

##### Example of json

```bash
# Simple JSON POST
curl --json '{"name":"John","age":30}' https://httpbin.org/post

# From JSON file
curl --json @data.json https://httpbin.org/post

# From stdin
echo '{"name":"John","age":30}' | curl --json @- https://httpbin.org/post

# Multiple JSON objects (last one used)
curl --json '{"name":"John"}' --json '{"age":30}' https://httpbin.org/post
```

#### 3. `-T, --upload-file <file>`

- Uploads a file to a server (HTTP PUT, FTP, SFTP, SCP).
- Use `-` to upload from keyboard input (stdin).
- Works with multiple files using multiple `-T` flags or globbing patterns.

**Basic patterns:**

| Pattern                | Description           | Example                      |
| ---------------------- | --------------------- | ---------------------------- |
| `-T file`              | Upload single file    | `-T document.txt`            |
| `-T -`                 | Upload from stdin     | `-T - < file.txt`            |
| `-T {a,b}`             | Upload multiple files | `-T "{file1.txt,file2.txt}"` |
| `-T [1-3]`             | Upload with globbing  | `-T "file[1-3].txt"`         |
| `--max-filesize <num>` | Limit upload size     | `--max-filesize 1000000`     |

**Important notes:**

- For FTP, use `--user username:password` for authentication.
- For HTTP PUT, the server must support file uploads.
- When uploading multiple files, specify target URLs separately or use the same URL for all.

##### Example of upload-file

```bash
# Upload single file to FTP
curl -T file.txt ftp://ftp.example.com/ --user username:password

# Upload multiple files (list)
curl -T "{file1.txt,file2.txt}" ftp://ftp.example.com/ --user username:password

# Upload multiple files (range)
curl -T "file[1-3].txt" ftp://ftp.example.com/ --user username:password

# Upload from stdin
curl -T - ftp://ftp.example.com/remote.txt --user username:password < local.txt
echo "content" | curl -T - ftp://ftp.example.com/file.txt --user username:password

# Upload to HTTP PUT endpoint
curl -T file.txt http://example.com/upload

# Upload different files to different URLs
curl -T file1.txt http://example.com/upload1 -T file2.txt http://example.com/upload2
```

#### 4. `-F, --form <name=content>`

- Sends form data using `multipart/form-data` (HTTP POST).
- **Basic syntax:** `name=value` for text fields.
- **File upload:** `name=@filepath` sends file with filename.
- **File content only:** `name=<filepath` sends content without filename.

**Common patterns:**

| Pattern                    | Description            | Example                               |
| -------------------------- | ---------------------- | ------------------------------------- |
| `name=value`               | Send text field        | `name=John`                           |
| `name=@file`               | Upload file            | `photo=@image.jpg`                    |
| `name=<file`               | Send file content only | `text=<data.txt`                      |
| `field;type=mime`          | Set content type       | `file=@doc.pdf;type=application/pdf`  |
| `file=@path;filename=name` | Custom filename        | `file=@local.jpg;filename=remote.jpg` |

##### Example of form

```bash
# Text fields
curl -F "name=abdurrab" -F "age=21" https://httpbin.org/post

# Upload file
curl -F "image=@/path/to/image.jpg" https://httpbin.org/post

# Send file content as text
curl -F "description=<description.txt" https://httpbin.org/post

# Set content type
curl -F "web=@index.html;type=text/html" https://httpbin.org/post

# Custom server filename
curl -F "file=@local.txt;filename=server.txt" https://httpbin.org/post
```

### 4. `--url <url/file>`

- Sets the target URL to fetch.
- **Input methods:**
  - Direct URL: `"https://example.com"`
  - From file: `@filename`
  - From stdin: `@-`
- Use multiple `--url` flags for multiple URLs.

**Common patterns:**

| Pattern          | Description              | Example                   |
| ---------------- | ------------------------ | ------------------------- |
| `--url "url"`    | Fetch single URL         | `--url "https://api.com"` |
| `--url @file`    | Read URLs from file      | `--url @urls.txt`         |
| `--url @-`       | Read from keyboard input | `--url @-`                |
| Multiple `--url` | Fetch multiple URLs      | `--url url1 --url url2`   |

#### Example of url

```bash
# Single URL
curl --url "https://api.example.com/data"

# Read URLs from file (one URL per line)
curl --url @urls.txt

# Read from keyboard (type URLs, press Ctrl+D when done)
curl --url @-

# Multiple URLs
curl --url "https://example.com/page1" --url "https://example.com/page2"

# Pipe URLs from command
echo "https://example.com" | curl --url @-
```

**Note:** The `--url` option is often optional - you can provide URLs directly: `curl https://example.com`

### 3. `--url-query <data>`

- Adds query parameters to the URL (the part after `?`).
- Use multiple times to add multiple parameters.
- Prefix with `+` to skip URL encoding (sends data as-is).

**Common patterns:**

| Pattern      | Description             | Example                           |
| ------------ | ----------------------- | --------------------------------- |
| `name=value` | Add single parameter    | `--url-query "name=John"`         |
| `name@file`  | Read value from file    | `--url-query "data@file.txt"`     |
| `+raw`       | Skip encoding (use raw) | `--url-query "+name=John&age=21"` |

**Important notes:**

- Parameters are automatically URL-encoded unless prefixed with `+`.
- Works with all HTTP methods (GET, POST, etc.).
- Can combine with globbing patterns in URLs.

#### Example of url-query

```bash
# Single parameter
curl --url-query "name=abdurrab" https://httpbin.org/post

# Read parameter value from file
curl --url-query "name@file.txt" https://httpbin.org/post

# Multiple parameters (raw/unencoded)
curl --url-query "+name=abdurrab&age=21&skill=dev" https://httpbin.org/post

# Multiple --url-query flags
curl --url-query "name=abdurrab" --url-query "age=21" https://httpbin.org/post

# With globbing pattern
curl "https://httpbin.org/post?id=[1-5]"

# Combine with other options
curl -X POST --url-query "status=active" --url-query "limit=10" https://api.example.com/users
```

### 6. `-Z, --parallel`

- Downloads multiple URLs at the same time instead of one by one.
- Makes bulk downloads much faster.
- Default: 50 parallel transfers. Change with `--parallel-max <num>`.

**Common patterns:**

| Pattern                | Description                    | Example                |
| ---------------------- | ------------------------------ | ---------------------- |
| `-Z`                   | Enable parallel transfers      | `-Z url1 url2 url3`    |
| `--parallel-immediate` | Start transfers immediately    | `--parallel-immediate` |
| `--parallel-max <num>` | Limit parallel connections     | `--parallel-max 5`     |
| `-Z` with globbing     | Parallel downloads with ranges | `-Z "file[1-10].txt"`  |

#### Example of parallel

```bash
# Basic parallel download
curl -Z https://example.com/file1.txt https://example.com/file2.txt

# Parallel with globbing (10 files at once)
curl -Z "https://example.com/file[1-10].txt"

# Limit to 3 parallel transfers
curl -Z --parallel-max 3 "https://example.com/file[1-20].txt"

# Parallel upload to FTP
curl -Z -T "{file1.txt,file2.txt,file3.txt}" ftp://ftp.example.com/ --user username:password

# Parallel with custom output names
curl -Z "https://example.com/page[1-5].html" -o "download#1.html"

# Mix different URLs
curl -Z https://site1.com/data https://site2.com/info https://site3.com/content
```

### 7. `-b, --cookie <data/file>`

- Sends cookies to the server.
- **Input methods:**
  - Direct string: `"name=value"`
  - From file: `@filename`
  - From stdin: `@-`
- Can use multiple `-b` flags for multiple cookies.
- **Supported formats:**
  - HTTP header format: `name1=value1; name2=value2`
  - Netscape/Mozilla cookie file format

#### 7.1. `-c, --cookie-jar <file>`

- Saves cookies from server response to a file.
- Creates file if missing, overwrites if exists.

#### Example of cookie

```bash
# Send cookies as string
curl -b "session=abc123; user=john" https://example.com

# Read cookies from file
curl -b cookies.txt https://example.com

# Save response cookies to file
curl -c cookies.txt https://example.com

# Send and save cookies (common pattern)
curl -b cookies.txt -c cookies.txt https://example.com
```

### 8. `-w, --write-out <format>`

- Displays specific information about the request after it completes.
- Use variables like `%{http_code}` or `%{time_total}` in the format string.
- Add `\n` at the end for a newline.

**Input methods:**

| Pattern        | Description            | Example               |
| -------------- | ---------------------- | --------------------- |
| `-w "format"`  | Format string directly | `-w "%{http_code}\n"` |
| `-w "@file"`   | Read format from file  | `-w "@format.txt"`    |
| `-w "%{json}"` | Output all as JSON     | `-w "%{json}\n"`      |

**Useful variables:**

| Variable         | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `url`            | The requested URL -> (url.host, .scheme, .port, .path, .query, ) |
| `http_code`      | HTTP status code (200, 404, etc.)                                |
| `http_version`   | HTTP version (1.0, 1.1, 2, etc.)                                 |
| `http_connect`   | HTTP connect code (proxy status)                                 |
| `local_ip`       | Local IP address                                                 |
| `local_port`     | Local port number                                                |
| `redirect_url`   | URL after redirects                                              |
| `num_redirects`  | Number of redirects                                              |
| `url_effective`  | Final URL (after redirects)                                      |
| `scheme`         | URL scheme (http, https, ftp)                                    |
| `content_type`   | Response Content-Type                                            |
| `size_download`  | Total bytes downloaded                                           |
| `size_upload`    | Total bytes uploaded                                             |
| `speed_download` | Average download speed (bytes/sec)                               |
| `time_total`     | Total request time (seconds)                                     |
| `time_connect`   | Time to establish connection                                     |
| `json`           | All variables in JSON format                                     |

#### Example of write-out

```bash
# Basic - show status code
curl -w "Status: %{http_code}\n" -o /dev/null -s https://example.com

# Multiple variables
curl -w "Status: %{http_code}\nTime: %{time_total}s\nSize: %{size_download} bytes\n" \
  -o /dev/null -s https://example.com

# JSON format (all variables at once)
curl -w "%{json}\n" -o /dev/null -s https://example.com

# Read format from file
echo "Status: %{http_code}\nTime: %{time_total}s\n" > format.txt
curl -w "@format.txt" -o /dev/null -s https://example.com

# CSV format (for logging)
curl -w "%{http_code},%{time_total},%{size_download}\n" \
  -o /dev/null -s https://example.com
```

**Quick tip:** Use `-o /dev/null -s` to hide the response body and only see your custom output.

### 9. `-v, --verbose`

- Shows detailed information about what curl is doing.
- Helps you see what's happening behind the scenes (headers, connection info, etc.).
- Output appears in your terminal.

**Related options:**

| Option             | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `-s, --silent`     | Hide all output (quiet mode)                       |
| `-S, --show-error` | Use with `-s` to show only errors                  |
| `--trace <file>`   | Save complete connection details to a file         |
| `--trace-ascii`    | Same as `--trace` but easier to read (text format) |
| `--stderr <file>`  | Save verbose output to a file                      |

#### Example of verbose

```bash
# Show detailed request/response info
curl -v https://example.com

# Quiet mode (hide everything)
curl -s https://example.com

# Quiet mode but still show errors
curl -sS https://example.com

# Save all connection details to file
curl --trace trace.txt https://example.com

# Save details in readable text format
curl --trace-ascii trace.txt https://example.com

# Save verbose output to file instead of terminal
curl -v --stderr curl.log https://example.com
```

**Quick tip:** Use `-v` when something isn't working to see exactly what curl is sending and receiving.

### 10. `--compressed`

- Requests compressed responses from the server (gzip, deflate, etc.).
- curl automatically decompresses the data for you.
- **Benefits:**
  - Saves bandwidth
  - Faster downloads
  - Useful for large responses (JSON, HTML, etc.)

**How it works:**

1. Adds `Accept-Encoding` header to request
2. Server sends compressed data (if supported)
3. curl decompresses automatically

#### Example of compressed

```bash
# Request compressed response
curl --compressed https://example.com

# With verbose to see compression headers
curl -v --compressed https://api.example.com/data

# Combine with output
curl --compressed https://example.com/large-file.json -o data.json
```

**Quick tip:** Always use `--compressed` when downloading large text files or API responses to save time and bandwidth.

### 11. `-K, --config <file>`

- Reads curl options from a file instead of typing them in the command line.
- One option per line. Lines starting with `#` are comments.
- Use `-K -` to read from stdin (keyboard input).

**Benefits:**

- Reuse complex commands
- Keep sensitive data separate
- Share configurations easily

**File format:**

- `option = value` (spaces around `=` optional)
- Quote values with spaces: `"value with spaces"`
- Escape sequences: `\n`, `\t`, `\\`

**File format rules:**

- Remove the leading dashes from curl options
- Long options: Remove `--` (e.g., `--output` → `output`)
- Short options: Remove `-` (e.g., `-H` → `header`)

**Examples:**

```txt
# Original command line:
curl -X POST --header "Content-Type: application/json" -d "data" --output file.txt

# In config file:
request = "POST"
header = "Content-Type: application/json"
data = "data"
output = "file.txt"
```

**Quick reference:**

| Command line       | Config file |
| ------------------ | ----------- |
| `--output`         | `output`    |
| `-H` / `--header`  | `header`    |
| `-d` / `--data`    | `data`      |
| `-X` / `--request` | `request`   |
| `-o`               | `output`    |
| `--url`            | `url`       |
| `-v` / `--verbose` | `verbose`   |

**Common patterns:**

| Pattern     | Description                       |
| ----------- | --------------------------------- |
| `-K file`   | Read from file                    |
| `-K -`      | Read from stdin                   |
| `# comment` | Add comment                       |
| `-q`        | Skip default config (`~/.curlrc`) |

#### Example of config file

**config.txt:**

```txt
# API Configuration
url = "https://httpbin.org/post"
request = "POST"
header = "Authorization: Bearer token123"
header = "Content-Type: application/json"
data = "{\"name\":\"John\",\"age\":30}"
output = "response.json"
compressed
verbose
```

**Usage:**

```bash
# Use config file
curl -K config.txt

# Multiple configs
curl -K auth.txt -K request.txt

# Skip default config
curl -q -K custom.txt
```

## Others

1. **`--local-port <range>`:** Specify local port range for outgoing connections. which can be useful when want to switch between specific ports.
   - Example: `curl --local-port 8000-8100 http://example.com`
2. **Fail**

   - **`-f, --fail`:** Fail silently on server errors (HTTP status codes 400 and above).

     - Example: `curl -f http://example.com/nonexistent` # Will not output error page, just exit with non-zero status.

   - **`--fail-with-body`:** Like `-f`, but still outputs the response body on server errors.

     - Example: `curl --fail-with-body http://example.com/nonexistent`

3. **Retry**

   1. **`--retry <num>:** Retry the request up to `<num>` times on transient errors (like network issues or 5xx server errors).
      - Example: `curl --retry 3 http://example.com`
   2. **`--retry-delay <seconds>`:** Wait this many seconds between retries.
      - Example: `curl --retry 3 --retry-delay 5 http://example.com`
   3. **`--retry-max-time <seconds>`:** Limit the total time spent on retries.
      - Example: `curl --retry
   4. **`--retry-all-errors`:** Retry on all errors, not just transient ones.
      - Example: `curl --retry 3 --retry-all-errors http://example.com`

4. **`-u, --username <user:password>`**

   - Specify username and password for server authentication.
   - Example: `curl -u user:pass http://example.com`

5. **`-A, --user-agent <name>`**

   - Set the User-Agent string for the request.
   - Example: `curl -A "MyApp/1.0" http://example.com`

6. **`--rate <max request rate>`**

   - Limit the request rate to a maximum number of requests per second.
     - Example: `curl --rate 10 http://example.com` # Limit to 10 requests per second

7. **`--connect-timeout <second>`**

   - Maximum time in seconds to wait for a connection to be established.
     - Example: `curl --connect-timeout 5 http://example.com` # Timeout if connection takes longer than 5 seconds

8. **`-Y, --speed-limit <second>`**

   - Stop the transfer if the speed is below a certain threshold for a specified time.
     - Example: `curl --speed-limit 1000 --speed-time 10 http://example.com` # Stop if speed < 1000 bytes/sec for 10 seconds

9. **`-y, --speed-time <second>`**

   - Time in seconds to consider for speed limit.
     - Example: `curl --speed-limit 1000 --speed-time 10 http://example.com` # Stop if speed < 1000 bytes/sec for 10 seconds

10. `-:, --next`

    - Allows us to specify multiple requests in a single command line. Each `--next` indicates the start of a new request.
      - Example: `curl http://example.com --next -X POST -d "name=John" http://example.com/api`

11. `-L, --location`

    - Follow redirects (HTTP 3xx responses).
      - Example: `curl -L http://example.com` # Follows redirects to the final URL

12. `-s, --silent`

    - Silent mode. Hides progress meter and error messages.
      - Example: `curl -s http://example.com` # No output unless there's an error

13. `-I, --head`

    - Fetch only the headers of a response (HEAD request).
      - Example: `curl -I http://example.com` # Shows only response headers

14. `--output-null`

    - Discards the output (like sending to `/dev/null`).
      - Example: `curl --output-null http://example.com` # No output is shown or saved

15. `--list-only`

    - List only the names of files in an FTP directory.
      - Example: `curl --list-only ftp://ftp.example.com/` # Lists files in the FTP directory
