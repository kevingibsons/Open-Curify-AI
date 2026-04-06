from core.faq import match_faq_response


def test_identity_owner_response_matches_expected_text():
    assert (
        match_faq_response("Who is your owner?")
        == "I was created by Kevin Gibson S, Director of Crsynk Labs, as an open-source AI chatbot and assistant."
    )


def test_non_faq_message_returns_none():
    assert match_faq_response("Explain recursion in Python.") is None
