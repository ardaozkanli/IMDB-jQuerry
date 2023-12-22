import { showErrorPopup, url } from "../services/services.js";

$(document).ready(function () {
  checkAccessToken();
  getMovies();

  $("#exampleInputGenre").select2({
    theme: "bootstrap-5",
    width: $(this).data("width")
      ? $(this).data("width")
      : $(this).hasClass("w-100")
      ? "100%"
      : "style",
    placeholder: $(this).data("placeholder"),
  });

  function checkAccessToken() {
    let accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      console.log("Token is valid user has entered");
      console.log(accessToken);
    } else {
      console.log("Token is not valid user has to login");
      window.location.href = "../Auth/Login/login.html";
    }
  }

  let genres = [];

  $.ajax({
    type: "GET",
    url: `${url}/get-genres`,
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
    success: function (response) {
      genres = response.data;
      console.log(genres);
      genres = response.data;
      console.log(genres);
      let selectBox = $("#exampleInputGenre");
      selectBox.empty();
      for (let i = 0; i < genres.length; i++) {
        let option = $("<option>").text(genres[i]);
        selectBox.append(option);
      }
    },
    error: function (error) {
      showErrorPopup(error.responseJSON.message);
    },
  });

  let movieData = [];
  function getMovies() {
    $.ajax({
      type: "GET",
      url: `${url}/get-movies`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      success: function (response) {
        console.log(response);

        if (response.data.length > 0) {
          movieData = response.data;
          listMovies(movieData);
        }
      },
      error: function (error) {
        showErrorPopup(error.responseJSON.message);
      },
    });
  }

  $(".log-out-btn").click(function () {
    sessionStorage.removeItem("access_token");
  });

  $(".movie-list").on("click", ".movie-item", function () {
    let movie_id = $(this).data("movie-id");
    let newURL = `../Movies/movies_detail.html?v=${movie_id}`;
    window.location.href = newURL;
  });

  //   $("input[type='checkbox']").change(function () {
  //     $("input[type='checkbox']").not(this).prop("checked", false);
  //     movieFilter();
  //   });

  let filterInputs = [
    $("#exampleInputRating"),
    $("#film-title-input"),
    $("#exampleInputGenre"),
  ];

  filterInputs.forEach(function (input) {
    input.on("change", function () {
      movieFilter();
    });
  });
  function movieFilter() {
    let titleFilter = $("#film-title-input").val().toLowerCase();
    let imdbFilter = parseFloat($("#exampleInputRating").val());
    let selectedGenres = $("#exampleInputGenre").val();

    let filteredMovies = movieData.filter(function (movie) {
      let titleMatch =
        titleFilter.length === 0 ||
        movie.Series_Title.toLowerCase().includes(titleFilter);

      let imdbMatch = isNaN(imdbFilter) || movie.IMDB_Rating >= imdbFilter;

      let genreMatch =
        !selectedGenres ||
        selectedGenres.length === 0 ||
        selectedGenres.every((selectedGenre) =>
          movie.Genre.includes(selectedGenre)
        );

      return titleMatch && imdbMatch && genreMatch;
    });

    listMovies(filteredMovies);
  }

  function listMovies(movies) {
    $(".movie-list").empty();

    movies.forEach(function (movie) {
      let movieListItem = $(`
            <div class = "col-md-2">
            <div class="card rounded movie-item d-flex flex-column h-100" data-movie-id="${movie._id}">
                <img class="card-img-top " src="${movie.Poster_Link}" alt="movie image" />
                <div class="card-body mt-2 ">
                    <h5 class="card-title">${movie.Series_Title}</h5>
                    <p class="card-text"><strong>IMDB</strong>:${movie.IMDB_Rating}</p>
                    <p class="card-text"><strong>Genre</strong>:${movie.Genre}</p>
                </div>
                <div class="card-footer d-flex gap-2">
                    <div class="edit-btn btn btn-outline-primary" data-movie-id="${movie._id}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                    </div>
                        <div class ="delete-btn btn btn-outline-danger" data-movie-id="${movie._id}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"      fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </div>   
                </div>
                </div>
            </div>
        `);

      $(".movie-list").append(movieListItem);
    });
  }

  let movieId; //global movieID used for delete request

  $(".movie-list").on("click", ".delete-btn", function (event) {
    event.stopPropagation(); //
    movieId = $(this).data("movie-id");
    $("#delete-modal").modal("show");
  });

  $(".movie-list").on("click", ".edit-btn", function (event) {
    event.stopPropagation();
    let movie_id = $(this).data("movie-id");
    let newURL = `../Movies/Edit_Movies/editmovie.html?v=${movie_id}`;
    window.location.href = newURL;
  });

  //yes button
  $(".confirm-delete-btn").click(function () {
    $.ajax({
      type: "DELETE",
      url: `${url}/delete-movie/${movieId}`,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
      },
      success: function (response) {
        console.log(response);

        $(`.card[data-movie-id="${movieId}"]`).remove();
        getMovies();
      },
      error: function (error) {
        showErrorPopup(error.responseJSON.message);
      },
    });
    $("#delete-modal").modal("hide");
  });
});
