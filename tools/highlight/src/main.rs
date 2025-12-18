use anyhow::{Context, Result};
use arborium::{Config, Highlighter, HtmlFormat};
use clap::Parser;
use regex::{Captures, Regex};
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

#[derive(Parser, Debug)]
#[command(name = "highlight")]
#[command(about = "Pre-process markdown files with arborium syntax highlighting")]
struct Args {
    /// Input directory containing markdown files
    #[arg(short, long, default_value = "content")]
    input: PathBuf,

    /// Output directory for processed files (defaults to input dir for in-place processing)
    #[arg(short, long)]
    output: Option<PathBuf>,

    /// Only show what would be processed, don't write files
    #[arg(long)]
    dry_run: bool,
}

fn main() -> Result<()> {
    let args = Args::parse();

    let config = Config {
        html_format: HtmlFormat::ClassNames,
        ..Default::default()
    };
    let mut highlighter = Highlighter::with_config(config);

    let mut processed_count = 0;

    for entry in WalkDir::new(&args.input) {
        let entry = entry?;
        let path = entry.path();

        if path.extension().map_or(false, |ext| ext == "md") {
            let relative_path = path.strip_prefix(&args.input)?;

            let output_path = match &args.output {
                Some(output_dir) => output_dir.join(relative_path),
                None => path.to_path_buf(),
            };

            if args.dry_run {
                println!("Would process: {}", path.display());
                continue;
            }

            match process_file(&mut highlighter, path, &output_path) {
                Ok(changed) => {
                    if changed {
                        println!("Processed: {}", path.display());
                        processed_count += 1;
                    }
                }
                Err(error) => {
                    eprintln!("Error processing {}: {}", path.display(), error);
                }
            }
        }
    }

    println!("Processed {} files", processed_count);
    Ok(())
}

fn process_file(highlighter: &mut Highlighter, input: &Path, output: &Path) -> Result<bool> {
    let content = fs::read_to_string(input)
        .with_context(|| format!("Failed to read {}", input.display()))?;

    let processed = process_markdown(highlighter, &content)?;

    if processed == content {
        return Ok(false);
    }

    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent)?;
    }

    fs::write(output, processed)
        .with_context(|| format!("Failed to write {}", output.display()))?;

    Ok(true)
}

fn process_markdown(highlighter: &mut Highlighter, content: &str) -> Result<String> {
    // Match fenced code blocks: ```lang ... ```
    // This regex captures:
    // - Group 1: the language identifier
    // - Group 2: the code content
    let code_block_regex = Regex::new(r"```(\w+)\n([\s\S]*?)```")?;

    let result = code_block_regex.replace_all(content, |caps: &Captures| {
        let lang = &caps[1];
        let code = &caps[2];

        highlight_code_block(highlighter, lang, code)
    });

    Ok(result.into_owned())
}

fn highlight_code_block(highlighter: &mut Highlighter, lang: &str, code: &str) -> String {
    let lang_normalized = normalize_language(lang);

    // Remove trailing newline for cleaner output
    let code_trimmed = code.trim_end_matches('\n');

    match highlighter.highlight(&lang_normalized, code_trimmed) {
        Ok(highlighted) => {
            format!(
                "<pre><code class=\"language-{}\">{}</code></pre>",
                lang, highlighted
            )
        }
        Err(_) => {
            // If highlighting fails, fall back to escaped plain code
            format!(
                "<pre><code class=\"language-{}\">{}</code></pre>",
                lang,
                html_escape(code_trimmed)
            )
        }
    }
}

fn normalize_language(lang: &str) -> String {
    match lang.to_lowercase().as_str() {
        "rs" => "rust".to_string(),
        "js" => "javascript".to_string(),
        "ts" => "typescript".to_string(),
        "sh" | "shell" | "zsh" => "bash".to_string(),
        "yml" => "yaml".to_string(),
        other => other.to_string(),
    }
}

fn html_escape(text: &str) -> String {
    text.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
}
