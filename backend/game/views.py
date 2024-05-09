# views.py
from django.shortcuts import render, redirect, reverse
from django.contrib import messages
from django.http import JsonResponse,  HttpResponse, Http404
from .models import CustomUser
from .serializers import *
from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from rest_framework.decorators import api_view
from rest_framework.permissions import BasePermission, IsAuthenticated
from django.contrib.auth.decorators import login_required
from .models import *
from .serializers import *
from website.views import IsSuperUser
import requests

#---------------------------------------------
# Game
#---------------------------------------------
   
class GameViewSet(viewsets.ModelViewSet): #to get infos of all the games ...
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    permission_classes = {IsSuperUser}

@api_view(['GET'])
@login_required
def game_info(request):  #to get infos of the current game ...
    game = request.game
    serializer = GameSerializer(game)
    return Response(serializer.data, safe=False)

@api_view(['POST'])
@login_required
def games_list(request): #to send game data to the database...
    serializer = GameSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@login_required
def game_detail(request, id): 
    try:
        game = Game.objects.get(pk=id) #to use/manipulate infos of a chosen game ...
    except Game.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GameSerializer(game)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = GameSerializer(game, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        game.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
#---------------------------------------------
# Party
#---------------------------------------------

class PartyViewSet(viewsets.ModelViewSet):
    queryset = Party.objects.all()
    serializer_class = PartySerializer
    permission_classes = {IsSuperUser}

@api_view(['GET'])
@login_required
def party_info(request):
    party = request.party
    serializer = PartySerializer(party)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@login_required
def parties_list(request):
    if request.method == 'POST':
        serializer = PartySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@login_required
def party_detail(request, id):
    try:
        party = Party.objects.get(pk=id)
    except Party.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PartySerializer(party)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        serializer = PartySerializer(party, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        party.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PartyStatsViewSet(viewsets.ModelViewSet):
    queryset = PartyStats.objects.all()
    serializer_class = PartyStatsSerializer
    permission_classes = {IsSuperUser}

@api_view(['GET'])
@login_required
def party_stats_info(request):
    party = request.party
    serializer = PartySerializer(party)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@login_required
def parties_stats_list(request):
    if request.method == 'POST':
        serializer = PartyStatsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@login_required
def party_stats_detail(request, id):
    try:
        user = PartyStats.objects.get(pk=id)
    except PartyStats.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PartyStatsSerializer(user)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        serializer = PartyStatsSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

#---------------------------------------------
# Lobby
#---------------------------------------------

class LobbyViewSet(viewsets.ModelViewSet):
    queryset = Lobby.objects.all()
    serializer_class = LobbySerializer
    permission_classes = {IsSuperUser}

@api_view(['GET'])
@login_required
def lobby_info(request):
    if request.method == 'GET':
        lobby = request.game
        serializer = LobbySerializer(lobby)
        return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
@login_required
def Lobbies_list(request):
    if request.method == 'POST':
        serializer = LobbySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@login_required
def lobby_detail(request, id):
    try:
        lobby = Lobby.objects.get(pk=id)

    except Lobby.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = LobbySerializer(lobby)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        serializer = LobbySerializer(lobby, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        lobby.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class UserInLobbyViewSet(viewsets.ModelViewSet):
    queryset = UserInLobby.objects.all()
    serializer_class = UserInLobbySerializer
    permission_classes = {IsSuperUser}

@api_view(['GET'])
@login_required
def user_in_lobby_info(request):
    users = UserInLobby.objects.all()
    serializer = UserInLobbySerializer(users, many=True)
    return JsonResponse(serializer.data, safe=False)
    
@api_view(['GET', 'POST'])
@login_required
def user_in_lobby_list(request):
    if request.method == 'POST':
        serializer = UserInLobbySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@login_required
def user_in_lobby_detail(request, id):
    try:
        user = UserInLobby.objects.get(pk=id)
    except UserInLobby.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserInLobbySerializer(user)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        serializer = UserInLobbySerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
#---------------------------------------------
# tournament
#---------------------------------------------

class TournamentViewSet(viewsets.ModelViewSet):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = {IsSuperUser}

@api_view(['GET', 'POST'])
@login_required
def tournament_info(request):
    if request.method == 'GET':
        tour = Tournament.objects.all()
        serializer = TournamentSerializer(tour, many=True)
        return JsonResponse(serializer.data, safe=False)

def tournaments_list(request):
    if request.method == 'POST':
        serializer = TournamentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'DELETE'])
@login_required
def tournament_detail(request, id):
    try:
        tour = Tournament.objects.get(pk=id)
    except Tournament.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TournamentSerializer(tour)
        return JsonResponse(serializer.data)

    elif request.method == 'PUT':
        serializer = TournamentSerializer(tour, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        tour.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)