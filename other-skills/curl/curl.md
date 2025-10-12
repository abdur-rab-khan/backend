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
      - [Example](#example)
    - [`-H`, `--header <header/@file>`](#-h---header-headerfile)
      - [`@-` Symbol](#--symbol)
      - [Example of header](#example-of-header)
    - [`--url-query <data>`](#--url-query-data)
      - [Example of url-query](#example-of-url-query)
    - [`--url <url/file>`](#--url-urlfile)
      - [Example of url](#example-of-url)
    - [`-T, --upload-file <file>`](#-t---upload-file-file)
      - [Example of upload-file](#example-of-upload-file)
    - [`-F, --form <name=content>`](#-f---form-namecontent)
    - [`-Z, --parallel`](#-z---parallel)
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

- By default, `curl` outputs the response body to the terminal.
- Use `-o <file>` or `--output <file>` to save the output to a file.
- Use `-O` or `--remote-name` to save the file with its original name from the URL.
- Use `--output-dir <directory>` to save files in a specific directory.
- Use `-J` or `--remote-header-name` to use the server-specified filename from the `Content-Disposition` header when saving files.
- If we use globbing to fetch multiple files, `#` in the filename will be replaced by the URL part that matched the glob pattern.

#### Example of output

```bash
curl \
 -X GET \
 --output-dir "python" \
  'https://www.geeksforgeeks.org/python/{python-programming-language-tutorial,introduction-to-python,python-string,python-variables}/' \
   -o "#1.html"

# Calling multiple URLs and saving to different files
curl -o aa example.com -o bb example.net

# We can also use like following order, here order doesn't matter
curl example.com example.net -o aa -o bb

# Using multiple globbing patterns
curl "http://{site,host}.host[1-5].example" -o "#1_#2"
```

- `#1` is replaced by the first glob pattern match (e.g., `site` or `host`).
- `#2` is replaced by the second glob pattern match (e.g., `1

## Used Options

### 1. `-X`, `--request <command>`

- Sets the request method (e.g., GET, POST, PUT, DELETE).

**HTTP:**

- `GET`: Get data from server
- `POST`: Send data to create/update resource
- `PUT`: Update resource
- `DELETE`: Remove resource
- `HEAD`: Get headers only

**FTP:**

- `RETR`: Download file
- `STOR`: Upload file
- `DELE`: Delete file
- `NLST`: List files

**SMTP:**

- `MAIL`: Start email
- `RCPT`: Set recipient
- `DATA`: Send email body

**IMAP:**

- `SELECT`: Choose mailbox
- `FETCH`: Get messages
- `STORE`: Update message flags

#### Example

```bash
curl -X POST "https://api.example.com/data" -H "Content-Type: application/json" -d '{"key":"value"}'
```

**NOTE:** We can include `-I` or `--head` to fetch headers only (sends a HEAD request).

### `-H`, `--header <header/@file>`

- Adds extra headers to your request (works with HTTP, IMAP, SMTP).
- We can use multiple `-H` flags to add multiple headers.
- Without this option, curl automatically adds `Host:` and `User-Agent:` headers.
- For empty headers, end with a semicolon: `-H "X-Custom-Header;"`
- Read headers from a file using `@filename` or from keyboard input using `@-`.

#### `@-` Symbol

- `@-` means "read the header from keyboard input (stdin) instead of a file."

**Examples:**

1. Type header directly:

```bash
curl -H @- https://api.example.com
# Type your header, then press Ctrl+D (Mac/Linux) or Ctrl+Z (Windows)
```

2. Pipe from another command:

```bash
echo "Authorization: Bearer token123" | curl -H @- https://api.example.com
```

#### Example of header

**Multiple headers at once:**

```bash
{
  echo "Authorization: Bearer token123"
  echo "Content-Type: application/json"
  echo "X-Custom-Header: customValue"
} | curl -H @- https://api.example.com
```

**Individual headers:**

```bash
curl -H "X-First-Name: Joe" https://example.com
curl -H "User-Agent: yes-please/2000" https://example.com
curl -H "Host:" https://example.com
curl -H @headers.txt https://example.com
curl -H "Authorization: Bearer token123" -H "Content-Type: application/json" https://api.example.com
```

### `--url-query <data>`

- Appends data to the URL's query string.
- Multiple `--url-query` options can be used to add multiple parameters.
- If arguments starts with `+`, the rest of the provided string is added as-is without encoding.

#### Example of url-query

```bash
curl -X POST --url-query "name=abdurrab" https://httpbin.org/post

# make name=content of file.txt
curl -X POST --url-query name@file.txt https://httpbin.org/post

# multiple parameters
curl -X POST --url-query "+name=abdurrab&age=21&skill=dev" https://httpbin.org/post

# using globbing
curl -X POST https://httpbin.org/post?id=[1-5]
```

### `--url <url/file>`

- Specifies the URL to fetch.
- Can read URLs from a file using `@filename` or from keyboard input using `@-`.
- Multiple `--url` options can be used to fetch multiple URLs.

#### Example of url

```bash
curl --url "https://api.example.com/data" # Fetch single URL
curl --url @urls.txt # Fetch URLs from a file or use "@urls.txt"
curl --url @- # Fetch URLs from keyboard input (stdin)
```

### `-T, --upload-file <file>`

- Uploads a file to a remote server (works with FTP, SFTP, SCP, HTTP PUT).
- Use `-` to read from standard input (stdin).
- Multiple `-T` options can be used to upload multiple files.

#### Example of upload-file

```bash
curl -T localfile.txt ftp://ftp.example.com/ --user username:password
curl -T "{file1.txt,file2.txt}" ftp://ftp.example.com/ --user username:password
curl -T "file[1-3].txt" ftp://ftp.example.com/ --user username:password

# Upload from stdin
curl -T - ftp://ftp.example.com/ --user username:password < localfile.txt

curl -T file -T file1 http://example.com/upload http://example.com/upload1
```

### `-F, --form <name=content>`

- Submits form data (works with HTTP, SMTP, IMAP).
- This makes curl POST the data as `multipart/form-data`.
- Use `name=content` to send simple text fields.
- To force the content to be send as a file, use `name=@filename`.
- To get just the content of a file without the filename, use `name=<filename`.

```bash
# Example of form
curl -F "name=abdurrab" -F "age=21" https://httpbin.org/post

# Upload a file
curl -F "image=@/path/to/image.jpg" https://httpbin.org/post

# Send file content as a form field
curl -F "description=<description.txt" https://httpbin.org/post

# Specify content type
curl -F "web=index.html;type=text/html" https://httpbin.org/post

# Explicitly set filename in form upload
curl -F "file=@file1;filename=nameinserver" https://httpbin.org/post
```

### `-Z, --parallel`

- Enables parallel transfers for multiple URLs. instead of fetching URLs one after another, curl will fetch them simultaneously.
- This can significantly speed up the process when dealing with many URLs.

## Others

1. **`--local-port <range>`:** Specify local port range for outgoing connections. which can be useful when want to switch between specific ports.
   - Example: `curl --local-port 8000-8100 http://example.com`
2. **Fail**

   - **-f, --fail:** Fail silently on server errors (HTTP status codes 400 and above).

     - Example: `curl -f http://example.com/nonexistent` # Will not output error page, just exit with non-zero status.

   - **--fail-with-body:** Like `-f`, but still outputs the response body on server errors.

     - Example: `curl --fail-with-body http://example.com/nonexistent`

3. **Retry**

   1. **--retry <num>:** Retry the request up to `<num>` times on transient errors (like network issues or 5xx server errors).
      - Example: `curl --retry 3 http://example.com`
   2. **--retry-delay <seconds>:** Wait this many seconds between retries.
      - Example: `curl --retry 3 --retry-delay 5 http://example.com`
   3. **--retry-max-time <seconds>:** Limit the total time spent on retries.
      - Example: `curl --retry
   4. **--retry-all-errors:** Retry on all errors, not just transient ones.
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
