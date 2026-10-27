import React from "react";

interface NoScriptLoaderProps extends React.HTMLAttributes<HTMLElement> {
	scriptBody?: string | null;
	scriptId?: string;
}

const NoScriptLoader = ({ scriptBody, scriptId, ...props }: NoScriptLoaderProps) => {
	return scriptBody ? (
		<noscript
			id={scriptId || "custom-no-script"}
			dangerouslySetInnerHTML={{ __html: scriptBody }}
			// strategy="beforeInteractive"
			{...props}
		/>
	) : null;
};

export default NoScriptLoader;
