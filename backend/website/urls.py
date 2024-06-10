from django.urls import path, include
from .api import *
from .api.customUser_api import CustomUserViewSet
from .api.lobby_api import LobbyViewSet, UserInLobbyViewSet
from .api.party_api import PartyViewSet
from .api.partyInTour_api import PartyInTournamentViewSet
from .api.game_api import GameViewSet
from .api.userStats_api import UserStatsViewSet
from .api.tournament_api import TournamentViewSet
#from django.conf import settings
#from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
#from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('users', CustomUserViewSet, basename='users') # to get current user infos, use /users/me
router.register('party', PartyViewSet, basename='party')
router.register('party_in_tour', PartyInTournamentViewSet, basename='party_in_tour')
router.register('lobby', LobbyViewSet, basename='lobby')
router.register('user_in_lobby', UserInLobbyViewSet, basename='user_in_lobby') # to get current user infos, use /user_in_lobby/me
router.register('tournament', TournamentViewSet, basename='tournament')
router.register('game', GameViewSet, basename='game')
router.register('user_stats', UserStatsViewSet, basename='user_stats') # to get current user infos, use /user_stats/me

urlpatterns = [
	path('', include(router.urls)),
	path('update_alias/<int:pk>/', CustomUserViewSet.update_alias, name='update_alias'),
]

urlpatterns += router.urls