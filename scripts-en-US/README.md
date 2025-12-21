# Live Preview (VS Code + Live Server)

You can quickly open **the currently focused HTML file** in your browser using the Live Server extension.

## 1. One-time setup

1. Install the **Live Server** extension in VS Code  
   - Extensions (`Ctrl+Shift+X`) -> search `Live Server` -> install.

2. (Optional but recommended) Add a keyboard shortcut:
   1. Open **File -> Preferences -> Keyboard Shortcuts**
   2. Search: `Live Server: Open with Live Server`
   3. Click the pencil icon -> press your desired keys (e.g. `Alt+L Alt+O`) -> **Enter**.

## 2. Usage

1. Open an HTML file (e.g. `index.html`) in VS Code.
2. Run **Live Server** for the active file:
   - Either: `Ctrl+Shift+P` -> `Live Server: Open with Live Server`  
   - Or: use your custom shortcut.
3. A browser tab opens for that file.  
4. When you switch to another HTML file, repeat step 2 to open that one live.

> The browser will auto-reload whenever you save changes to the opened HTML file.







<br>
<br>
<br>
<br>










# htmls_to_json.pl

`htmls_to_json.pl` is a planned Perl script that scans `.html` files and generates **one valid JSON file**.

- Each HTML file becomes **a single JSON string value**.
- The **file name** determines the **nested JSON key path**.
- Output strictly follows **official JSON rules** (double quotes, proper escaping, no trailing commas).
- JSON is **always pretty-printed** (indented, human-readable formatting). There is **no flag** to switch to compact mode.

---

## 1. Behavior Summary

1. Detect all `.html` files under a **source directory** (recursively).
2. Convert each file name (without `.html`) into a **nested key path**.
3. Read the entire HTML content into a single scalar string.
4. Build one combined Perl hash representing all files.
5. Encode the hash as **JSON** with indentation and write it to an output file.

---

## 2. File Names -> JSON Keys

For a file:

```text
pi.article.body.html
```

Steps:

1. Strip `.html` -> `pi.article.body`  
2. Split by `.` -> `["pi", "article", "body"]`  
3. Build nested structure:

```json
{
  "pi": {
    "article": {
      "body": "<!-- HTML content here -->"
    }
  }
}
```

Example with multiple files:

- `pi.article.body.html`
- `pi.article.header.html`
- `index.html`

Result:

```json
{
  "pi": {
    "article": {
      "body": "<body html here>",
      "header": "<header html here>"
    }
  },
  "index": "<index html here>"
}
```

Notes:

- All keys and string values use **double quotes (`"`)**.
- HTML is stored **as-is**, only escaped as needed for valid JSON.

---

## 3. Source Path & Defaults

- **Source directory**:
  - If `--source` is **not** provided, the script uses the **directory where `htmls_to_json.pl` itself resides**.
  - If `--source` *is* provided, it scans that directory instead (recursively).

- **Output file**:
  - Default output filename is **`output.json`** in the current working directory.
  - Can be overridden with `--output`.

---

## 4. Usage

```bash
# 1) Default: source = script directory, output = output.json
perl htmls_to_json.pl

# 2) Custom output filename
perl htmls_to_json.pl --output custom.json

# 3) Explicit source directory + custom output
perl htmls_to_json.pl --source htmls_source/ --output custom.json

# 4) Explicit current directory as source + custom output
perl htmls_to_json.pl --source . --output custom.json
```





**Options**

- `--source <dir>`  
  Directory to scan for `.html` files (recursive).  
  Default: directory containing `htmls_to_json.pl`.

- `--output <file>`  
  Output JSON file name.  
  Default: `output.json`.

---

## 5. Implementation Plan (Perl)

Planned modules:

- `Getopt::Long` — parse `--source`, `--output`
- `File::Find` or `Path::Tiny` — recursively collect `.html` files
- `File::Basename` — extract base file name
- `JSON::PP` or `Cpanel::JSON::XS` — encode Perl data structure to JSON

High-level steps:

1. **Parse options**:
   - `--source`, `--output`.
   - Determine source directory:
     - If `--source` given -> use it
     - Else -> use script directory (`FindBin` or similar).
   - Determine output filename:
     - If `--output` given -> use it
     - Else -> `output.json`.

2. **Collect files**:
   - Recursively walk the source directory.
   - Keep only files with extension `.html` (case-insensitive if desired).

3. **Build data structure**:
   - For each `.html` file:
     - Get base name without directory (e.g., `pi.article.body.html`).
     - Strip `.html` -> `pi.article.body`.
     - Split by `.` to get path segments.
     - Walk/create nested hash keys along that path.
     - Read the entire file content into a string.
     - Assign that string to the leaf key.

4. **Encode as JSON** (always pretty):
   - Use a proper JSON encoder with pretty/indented output enabled:
     - Ensures double quotes, escaped characters, and valid JSON.
     - Produces multi-line, indented JSON for readability.

5. **Write output**:
   - Write encoded JSON string to the chosen output file.

---

## 6. Edge Cases & Guarantees

- **No HTML files found**:  
  Script should still produce a valid JSON file containing:

  ```json
  {}
  ```

- **Colliding paths** (two files resolving to the same key path):  
  - Later file overwrites earlier value.
  - Optionally, script may print a warning to `STDERR`.

- **JSON correctness**:
  - Always use a proper JSON module.
  - Never build JSON manually with string concatenation.
  - Guarantees:
    - Double quotes for keys and strings.
    - Escaped control characters.
    - No trailing commas.
    - Pretty, indented output by default.

---

## 7. Quick Test Setup

Example directory:

```text
examples/
  index.html
  pi.article.body.html
  pi.article.header.html
```

Run:

```bash
perl htmls_to_json.pl --source examples --output examples.json
```

Expected result:

- `examples.json` containing a single, pretty-printed JSON object:

```json
{
  "pi": {
    "article": {
      "body": "<body html here>",
      "header": "<header html here>"
    }
  },
  "index": "<index html here>"
}
```

This completes the plan for implementing `htmls_to_json.pl`.















<br>
<br>
<br>
<br>




# json_to_htmls.pl

`json_to_htmls.pl` is a planned Perl script that **reverses** the behavior of `htmls_to_json.pl`.

- It reads **one JSON file**.
- It expects a **nested object structure** where **leaf string values** are HTML content.
- It writes each leaf value to a corresponding `.html` file inside a fixed `out/` directory.

The mapping between JSON and file names is:

- JSON key path -> dot-joined base name -> `.html` file inside `out/`.

Example:

```json
{
  "pi": {
    "article": {
      "body": "<body html here>",
      "header": "<header html here>"
    }
  },
  "index": "<index html here>"
}
```

becomes:

```text
out/
  pi.article.body.html
  pi.article.header.html
  index.html
```

---

## 1. Source JSON & Output Directory

- **Source JSON file**:
  - Default: `output.json` in the current working directory.
  - Can be changed with `--source <file>`.

- **Output directory**:
  - Fixed name: `out`
  - Location: `out/` in the current working directory.
  - If `out/` does not exist, the script creates it.
  - If a file with the same name already exists in `out/`, it is overwritten.

---

## 2. Usage

```bash
# 1) Default source JSON = output.json, output HTML files in ./out
perl json_to_htmls.pl

# 2) Custom source JSON, output HTML files in ./out
perl json_to_htmls.pl --source custom.json
```

**Options**

- `--source <file>`  
  JSON file to read from.  
  Default: `output.json`.

There are **no other flags**: output always goes to `out/`.

---

## 3. Expected JSON Structure

The script expects a **JSON object at the top level**. Nested objects form the key path; any **string leaf** becomes one `.html` file.

Example JSON:

```json
{
  "pi": {
    "article": {
      "body": "<body html here>",
      "header": "<header html here>"
    }
  },
  "index": "<index html here>"
}
```

Resulting files:

- Key path `["pi", "article", "body"]` -> `pi.article.body.html`
- Key path `["pi", "article", "header"]` -> `pi.article.header.html`
- Key path `["index"]` -> `index.html`

**Rules:**

- Keys are joined with `.` to form the base file name.
- `".html"` is appended as the extension.
- Values must be strings; these strings are written directly into the files.

---

## 4. Behavior Summary

1. Read and decode the JSON from the `--source` file (default: `output.json`).
2. Traverse the nested structure recursively.
3. For each **string leaf value**:
   - Determine its full key path (e.g., `["pi", "article", "body"]`).
   - Join with dots -> `pi.article.body`.
   - Write the string to `out/pi.article.body.html`.
4. Create `out/` if it does not exist.
5. Overwrite existing files with the same name in `out/`.

---

## 5. Implementation Plan (Perl)

Planned modules:

- `Getopt::Long` — parse `--source`
- `JSON::PP` or `Cpanel::JSON::XS` — decode JSON safely
- `File::Path` — create `out/` if needed (`make_path`)
- `File::Spec` — build OS-safe paths

High-level steps:

1. **Parse options**:
   - Read `--source` (default: `output.json`).

2. **Read JSON**:
   - Open the JSON file.
   - Slurp the entire contents into a scalar.
   - Decode using a JSON module.
   - Verify the top-level is a hash reference (object).

3. **Traverse JSON**:
   - Use a recursive function:
     - Arguments: current node, array of key segments.
     - If the node is a hash (object): recurse into each key.
     - If the node is a string: generate a file name from the key segments.
     - Ignore non-hash, non-string nodes (or optionally warn).

4. **Generate file names & write HTML**:
   - Join key segments with `.` to form `basename`.
   - Append `.html`.
   - Build full path: `out/<basename>.html`.
   - Write the string value as file contents.

5. **Directory handling**:
   - Ensure `out/` exists using `File::Path::make_path`.
   - Overwrite any existing files in `out/` without prompting.

---

## 6. Edge Cases & Guarantees

- **Invalid JSON**:
  - Script should fail with a clear error message.

- **Non-object root**:
  - If the root is not a JSON object, script should abort with a message.

- **Non-string leaves**:
  - Non-string leaf values (numbers, booleans, null, arrays, etc.) are ignored or optionally warned about.

- **File name collisions**:
  - Since JSON keys in an object are unique at each level, each full path should map to a unique file name.
  - If a collision somehow occurs, the last written value will overwrite the earlier file.

- **JSON correctness**:
  - The script assumes the input is already valid JSON (double quotes, proper escaping, etc.).
  - It does not attempt to fix or reformat JSON; it only **reads and uses** it.

---

## 7. Quick Test Setup

Given this `output.json`:

```json
{
  "pi": {
    "article": {
      "body": "<body html here>",
      "header": "<header html here>"
    }
  },
  "index": "<index html here>"
}
```

Running:

```bash
perl json_to_htmls.pl
```

Should produce:

```text
out/
  pi.article.body.html       # contains: <body html here>
  pi.article.header.html     # contains: <header html here>
  index.html                 # contains: <index html here>
```

This completes the plan for implementing `json_to_htmls.pl`.
