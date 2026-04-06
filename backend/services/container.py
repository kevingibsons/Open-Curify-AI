from pathlib import Path

from config import settings
from core.file_processor import FileProcessor
from core.inference import Llama, LlamaCppBackend, MockInferenceBackend
from core.memory import ConversationMemory
from core.model_router import ModelRouter
from plugins.manager import PluginManager
from services.chat_orchestrator import ChatOrchestrator


class AppContainer:
    def __init__(self) -> None:
        self.initialized = False
        self.file_processor = FileProcessor()
        self.memory = ConversationMemory(settings.max_history_turns)
        self.plugin_manager = PluginManager()
        self.model_router = ModelRouter(ModelRouter.default_config_path())
        self.inference_backend = None
        self.chat_orchestrator = None

    def initialize(self) -> None:
        if self.initialized:
            return

        self.inference_backend = self._build_inference_backend()
        self.chat_orchestrator = ChatOrchestrator(
            memory=self.memory,
            router=self.model_router,
            inference_backend=self.inference_backend,
            plugin_manager=self.plugin_manager,
        )
        self.initialized = True

    def _build_inference_backend(self):
        if Path(settings.model_path).exists() and Llama is not None:
            return LlamaCppBackend()
        return MockInferenceBackend()

    def health_snapshot(self) -> dict:
        if not self.initialized:
            self.initialize()
        return {
            "status": "ok",
            "app": settings.app_name,
            "environment": settings.app_env,
            "model": self.inference_backend.health(),
        }


app_container = AppContainer()
