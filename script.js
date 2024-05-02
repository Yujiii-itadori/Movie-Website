require('dotenv').config();

const api_Key = process.env.TMDB_API_KEY; // Now you can use the API key safely

document.addEventListener('DOMContentLoaded', function() {
	const imgBaseUrl = 'https://image.tmdb.org/t/p/w500'; // Base URL for TMDb images
	const api_Key = process.env.api_Key // TMDb API key
	
  
	function fetchMovieTrailers(movieId, movieDiv) {
	  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${api_Key}`;
  
	  fetch(url)
		.then((response) => {
		  if (response.ok) {
			return response.json(); // Parse the JSON response
		  } else {
			throw new Error('Failed to fetch movie trailers');
		  }
		})
		.then((data) => {
		  const trailers = data.results.filter((video) => video.type === 'Trailer'); // Get trailer videos
		  if (trailers.length > 0) {
			const trailerLink = document.createElement('a');
			trailerLink.href = `https://www.youtube.com/watch?v=${trailers[0].key}`; // YouTube URL for the first trailer
			trailerLink.textContent = 'Watch Trailer';
			trailerLink.target = '_blank'; // Open in a new tab
  
			movieDiv.appendChild(trailerLink); // Add the trailer link to the movie div
		  }
		})
		.catch((error) => {
		  console.error('Error:', error);
		});
	}
  
	function fetchMovieDetails(movieId) {
	  const baseUrl = 'https://api.themoviedb.org/3/movie';
	  const url = `${baseUrl}/${movieId}?api_key=${api_Key}`;
  
	  return fetch(url)
		.then((response) => {
		  if (response.ok) {
			return response.json(); // Parse the JSON response
		  } else {
			throw new Error('Failed to fetch movie details');
		  }
		});
	}
  
	function displayResult(movie) {
	  const resultsContainer = document.getElementById('movie-results');
	  const movieDiv = document.createElement('div');
	  movieDiv.className = 'movie-result';
  
	  const title = document.createElement('h3');
	  title.textContent = `${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'N/A'})`;
  
	  const overview = document.createElement('p');
	  overview.textContent = movie.overview || 'No overview available';
  
	  const img = document.createElement('img');
	  img.src = movie.poster_path ? `${imgBaseUrl}${movie.poster_path}` : '';
	  img.alt = movie.title;
  
	  const rating = document.createElement('p');
	  rating.textContent = `Rating: ${movie.vote_average} / 10`;
  
	  movieDiv.appendChild(title);
	  movieDiv.appendChild(overview);
	  movieDiv.appendChild(img);
	  movieDiv.appendChild(rating);
  
	  resultsContainer.appendChild(movieDiv); // Add the movie div to the results container
  
	  fetchMovieTrailers(movie.id, movieDiv); // Fetch and display trailers
	}
  
	function searchMovies(query) {
	  const baseUrl = 'https://api.themoviedb.org/3/search/movie';
	  const url = `${baseUrl}?api_key=${api_Key}&query=${encodeURIComponent(query)}`;
  
	  fetch(url)
		.then((response) => {
		  if (response.ok) {
			return response.json();
		  } else {
			throw new Error('Failed to fetch movie data');
		  }
		})
		.then((data) => {
		  if (data.results.length > 0) {
			data.results.forEach((movie) => {
			  fetchMovieDetails(movie.id) // Fetch detailed movie information
				.then((movieDetails) => {
				  displayResult(movieDetails); // Display detailed results
				});
			});
		  } else {
			const resultsContainer = document.getElementById('movie-results');
			resultsContainer.textContent = 'No movies found'; // If no results are found
		  }
		})
		.catch((error) => {
		  console.error('Error:', error);
		});
	}
  
	document.getElementById('search-button').addEventListener('click', function() {
	  const query = document.getElementById('search-input').value.trim();
	  if (query) {
		searchMovies(query); // Trigger the search
	  } else {
		alert('Please enter a valid movie title'); // Alert if input is empty
	  }
	});
  
	document.getElementById('theme-toggle').addEventListener('click', function() {
	  document.body.classList.toggle('dark-theme'); // Toggle dark theme
	});
  });
  