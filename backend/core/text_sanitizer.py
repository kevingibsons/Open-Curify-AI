class StreamingTextSanitizer:
    def __init__(self) -> None:
        self.inside_think = False
        self.tag_buffer = ""

    def process(self, chunk: str) -> str:
        visible: list[str] = []

        for char in chunk:
            if self.tag_buffer:
                self.tag_buffer += char
                if char == ">":
                    tag = self.tag_buffer.lower()
                    if tag == "<think>":
                        self.inside_think = True
                    elif tag == "</think>":
                        self.inside_think = False
                    elif not self.inside_think:
                        visible.append(self.tag_buffer)
                    self.tag_buffer = ""
                continue

            if char == "<":
                self.tag_buffer = "<"
                continue

            if not self.inside_think:
                visible.append(char)

        return "".join(visible)

    def flush(self) -> str:
        if self.tag_buffer and not self.inside_think:
            leftover = self.tag_buffer
            self.tag_buffer = ""
            return leftover
        self.tag_buffer = ""
        return ""

