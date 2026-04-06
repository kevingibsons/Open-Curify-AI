from fastapi import APIRouter, File, HTTPException, UploadFile, status

from services.container import app_container

router = APIRouter(tags=["upload"])


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)) -> dict:
    app_container.initialize()
    payload = await file.read()

    try:
        return app_container.file_processor.process_upload(
            filename=file.filename or "document",
            content_type=file.content_type or "",
            data=payload,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
