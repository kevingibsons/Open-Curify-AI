from dataclasses import dataclass
from pathlib import Path

import yaml

from config import settings


@dataclass
class ModelSelection:
    model_name: str
    profile: str
    parameters: dict


class ModelRouter:
    def __init__(self, config_path: str) -> None:
        with open(config_path, "r", encoding="utf-8") as handle:
            self.config = yaml.safe_load(handle)

    def select(self, mode: str) -> ModelSelection:
        model_name = self.config["default_model"]
        model_config = self.config["models"][model_name]
        profile = mode or settings.model_default_profile
        parameters = model_config["profiles"].get(profile, model_config["profiles"][settings.model_default_profile])
        return ModelSelection(model_name=model_name, profile=profile, parameters=parameters)

    @staticmethod
    def default_config_path() -> str:
        return str(Path(__file__).resolve().parents[2] / "models" / "config.yaml")

