import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import {
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_REDIRECT_URI
} from "$env/static/public";

const scopes = [
	"user-read-private",
	"user-read-email",
	"playlist-read-private",
	"playlist-read-collaborative",
	"playlist-modify-private",
	"playlist-modify-public",
	"user-library-read",
	"user-library-modify"
];

export const spotify = SpotifyApi.withUserAuthorization(
	PUBLIC_SPOTIFY_CLIENT_ID,
	PUBLIC_SPOTIFY_REDIRECT_URI,
	scopes
);

export async function clearSpotifyState() {
	spotify.logOut();
}
