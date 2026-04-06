from core.language import detect_language


def test_detect_language_defaults_to_english_for_empty_text():
    assert detect_language("") == "en"


def test_detect_language_english():
    assert detect_language("Explain photosynthesis in simple terms.") == "en"

