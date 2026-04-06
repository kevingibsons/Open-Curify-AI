from langdetect import DetectorFactory, LangDetectException, detect

DetectorFactory.seed = 0

SUPPORTED_LANGUAGES = {"en", "ta", "hi"}


def detect_language(text: str) -> str:
    try:
        code = detect(text)
        return code if code in SUPPORTED_LANGUAGES else "en"
    except LangDetectException:
        return "en"

