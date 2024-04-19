import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";

import { Milkdown, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";

import "@milkdown/theme-nord/style.css";
interface MarkdownProps {
  markdown: string;
}

export default function MarkDownComp(props: MarkdownProps) {
  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, props.markdown);
      })
      .config(nord)
      .use(commonmark);
  }, []);

  return <Milkdown />;
}
