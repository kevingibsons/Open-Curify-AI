from functools import lru_cache

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


DEFAULT_ALLOWED_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]


class Settings(BaseSettings):
    app_name: str = Field(default="Open Curify AI", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    api_prefix: str = Field(default="/api", alias="API_PREFIX")
    allowed_origins: list[str] = Field(default_factory=lambda: DEFAULT_ALLOWED_ORIGINS.copy(), alias="ALLOWED_ORIGINS")
    model_path: str = Field(
        default=r"C:\Users\kevin\Desktop\CRSYNK OS\models\qwen3-1.7b.gguf",
        alias="MODEL_PATH",
    )
    model_context_length: int = Field(default=8192, alias="MODEL_CONTEXT_LENGTH")
    model_batch_size: int = Field(default=512, alias="MODEL_BATCH_SIZE")
    model_threads: int = Field(default=-1, alias="MODEL_THREADS")
    model_use_mmap: bool = Field(default=True, alias="MODEL_USE_MMAP")
    model_default_profile: str = Field(default="balanced", alias="MODEL_DEFAULT_PROFILE")
    max_history_turns: int = Field(default=10, alias="MAX_HISTORY_TURNS")
    max_file_characters: int = Field(default=6000, alias="MAX_FILE_CHARACTERS")
    max_file_size_mb: int = Field(default=10, alias="MAX_FILE_SIZE_MB")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        populate_by_name=True,
        extra="ignore",
        protected_namespaces=("settings_",),
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def split_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
