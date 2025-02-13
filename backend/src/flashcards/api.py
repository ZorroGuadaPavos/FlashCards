import uuid
from typing import Any

from fastapi import APIRouter, HTTPException

from src.auth.services import CurrentUser, SessionDep
from .schemas import (
    CollectionList,
    Collection,
    CardList,
    Card,
    CollectionCreate,
    CardCreate,
    CollectionUpdate,
    CardUpdate,
)
from . import services

router = APIRouter()


@router.get("/collections/", response_model=CollectionList)
def read_collections(
    session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100
) -> Any:
    collections, count = services.get_collections(
        session=session, user_id=current_user.id, skip=skip, limit=limit
    )
    return CollectionList(data=collections, count=count)


@router.post("/collections/", response_model=Collection)
def create_collection(
    session: SessionDep, current_user: CurrentUser, collection_in: CollectionCreate
) -> Any:
    return services.create_collection(
        session=session, collection_in=collection_in, user_id=current_user.id
    )


@router.get("/collections/{collection_id}", response_model=Collection)
def read_collection(
    session: SessionDep, current_user: CurrentUser, collection_id: uuid.UUID
) -> Any:
    collection = services.get_collection(
        session=session, id=collection_id, user_id=current_user.id
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return collection


@router.put("/collections/{collection_id}", response_model=Collection)
def update_collection(
    session: SessionDep,
    current_user: CurrentUser,
    collection_id: uuid.UUID,
    collection_in: CollectionUpdate,
) -> Any:
    collection = services.get_collection(
        session=session, id=collection_id, user_id=current_user.id
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    return services.update_collection(
        session=session, collection=collection, collection_in=collection_in
    )


@router.delete("/collections/{collection_id}", status_code=204)
def delete_collection(
    session: SessionDep, current_user: CurrentUser, collection_id: uuid.UUID
) -> None:
    collection = services.get_collection(
        session=session, id=collection_id, user_id=current_user.id
    )
    if not collection:
        raise HTTPException(status_code=404, detail="Collection not found")
    services.delete_collection(session=session, collection=collection)
    return


@router.get("/collections/{collection_id}/cards/", response_model=CardList)
def read_cards(
    session: SessionDep,
    current_user: CurrentUser,
    collection_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    if not services.check_collection_access(session, collection_id, current_user.id):
        raise HTTPException(status_code=404, detail="Collection not found")
    cards, count = services.get_cards(
        session=session, collection_id=collection_id, skip=skip, limit=limit
    )
    return CardList(data=cards, count=count)


@router.post("/collections/{collection_id}/cards/", response_model=Card)
def create_card(
    session: SessionDep,
    current_user: CurrentUser,
    collection_id: uuid.UUID,
    card_in: CardCreate,
) -> Any:
    if not services.check_collection_access(session, collection_id, current_user.id):
        raise HTTPException(status_code=404, detail="Collection not found")
    return services.create_card(
        session=session, collection_id=collection_id, card_in=card_in
    )


@router.get("/collections/{collection_id}/cards/{card_id}", response_model=Card)
def read_card(
    session: SessionDep,
    current_user: CurrentUser,
    collection_id: uuid.UUID,
    card_id: uuid.UUID,
) -> Any:
    if not services.check_collection_access(session, collection_id, current_user.id):
        raise HTTPException(status_code=404, detail="Collection not found")
    card = services.get_card_with_collection(session=session, card_id=card_id, user_id=current_user.id)
    if not card or card.collection_id != collection_id:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@router.put("/collections/{collection_id}/cards/{card_id}", response_model=Card)
def update_card(
    session: SessionDep,
    current_user: CurrentUser,
    collection_id: uuid.UUID,
    card_id: uuid.UUID,
    card_in: CardUpdate,
) -> Any:
    if not services.check_collection_access(session, collection_id, current_user.id):
        raise HTTPException(status_code=404, detail="Collection not found")
    card = services.get_card_with_collection(session=session, card_id=card_id, user_id=current_user.id)
    if not card or card.collection_id != collection_id:
        raise HTTPException(status_code=404, detail="Card not found")
    return services.update_card(session=session, card=card, card_in=card_in)


@router.delete("/collections/{collection_id}/cards/{card_id}", status_code=204)
def delete_card(
    session: SessionDep,
    current_user: CurrentUser,
    collection_id: uuid.UUID,
    card_id: uuid.UUID,
) -> None:
    if not services.check_collection_access(session, collection_id, current_user.id):
        raise HTTPException(status_code=404, detail="Collection not found")
    card = services.get_card_with_collection(session=session, card_id=card_id, user_id=current_user.id)
    if not card or card.collection_id != collection_id:
        raise HTTPException(status_code=404, detail="Card not found")
    services.delete_card(session=session, card=card)
    return
