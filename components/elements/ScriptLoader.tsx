"use client";
import React, { useEffect } from "react";
import Script, { type ScriptProps } from "next/script";

// The custom script saved in the admin panel can be plain JavaScript
// or full HTML snippets (e.g. `<script>...</script>`, `<noscript>...`).
const containsHtmlTags = (text: string) =>
	/<\s*\/?\s*(script|noscript|style|link|meta|iframe|img|div)\b/i.test(text);

const HEAD_TAGS = ["SCRIPT", "STYLE", "LINK", "META"];

// Injects an HTML snippet so its <script> tags actually run
// (scripts inserted via innerHTML never execute).
const HtmlSnippetLoader = ({ html, id }: { html: string; id: string }): null => {
	useEffect(() => {
		if (!html || document.querySelector(`[data-snippet-id="${id}"]`)) return;

		const template = document.createElement("template");
		template.innerHTML = html;

		Array.from(template.content.childNodes).forEach((node) => {
			if (node.nodeType !== Node.ELEMENT_NODE) return;

			let element: Element;
			if (node.nodeName === "SCRIPT") {
				const script = document.createElement("script");
				Array.from((node as Element).attributes).forEach((attr) =>
					script.setAttribute(attr.name, attr.value)
				);
				script.text = node.textContent ?? "";
				element = script;
			} else {
				element = node.cloneNode(true) as Element;
			}

			element.setAttribute("data-snippet-id", id);
			const target = HEAD_TAGS.includes(node.nodeName)
				? document.head
				: document.body;
			target.appendChild(element);
		});
	}, [html, id]);

	return null;
};

interface ScriptLoaderProps extends Omit<ScriptProps, "id"> {
	scriptBody?: string | null;
	scriptId?: string;
}

const ScriptLoader = ({ scriptBody, scriptId, ...props }: ScriptLoaderProps) => {
	if (!scriptBody) return null;

	const id = scriptId || "custom-script";

	if (containsHtmlTags(scriptBody)) {
		return <HtmlSnippetLoader html={scriptBody} id={id} />;
	}

	return (
		<Script
			id={id}
			dangerouslySetInnerHTML={{ __html: scriptBody }}
			// strategy="beforeInteractive"
			{...props}
		/>
	);
};

export default ScriptLoader;
