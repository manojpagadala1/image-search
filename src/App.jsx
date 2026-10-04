import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, ImageOff, LoaderCircle } from "lucide-react";

const API_URL = "https://api.unsplash.com/search/photos";
const COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php";
const RESULTS_PER_PAGE = 12;

function App() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("nature");
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usingCommons, setUsingCommons] = useState(false);

  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  useEffect(() => {
    fetchPhotos(submittedQuery, page);
  }, [submittedQuery, page]);

  async function fetchPhotos(searchTerm, currentPage) {
    setLoading(true);
    setError("");
    setUsingCommons(false);

    try {
      if (!accessKey) {
        await fetchCommonsPhotos(searchTerm, currentPage);
        return;
      }

      const params = new URLSearchParams({
        client_id: accessKey,
        query: searchTerm,
        page: String(currentPage),
        per_page: String(RESULTS_PER_PAGE),
        orientation: "landscape"
      });

      const response = await fetch(`${API_URL}?${params}`);

      if (!response.ok) {
        if (response.status === 401) {
          await fetchCommonsPhotos(searchTerm, currentPage);
          return;
        }
        if (response.status === 403) {
          throw new Error("Unsplash API rate limit reached. Please try again later.");
        }
        throw new Error("Unable to fetch images. Please try again.");
      }

      const data = await response.json();

      setPhotos(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 100));
    } catch (err) {
      setPhotos([]);
      setTotalPages(1);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchCommonsPhotos(searchTerm, currentPage) {
    const params = new URLSearchParams({
      action: "query",
      generator: "search",
      gsrsearch: searchTerm,
      gsrnamespace: "6",
      gsrinfo: "totalhits",
      gsrlimit: String(RESULTS_PER_PAGE),
      gsroffset: String((currentPage - 1) * RESULTS_PER_PAGE),
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "640",
      format: "json",
      origin: "*"
    });
    const response = await fetch(`${COMMONS_API_URL}?${params}`);

    if (!response.ok) {
      throw new Error("Unable to fetch images from Wikimedia Commons. Please try again.");
    }

    const data = await response.json();
    const pages = Object.values(data.query?.pages || {});
    const results = pages.flatMap((page) => {
      const image = page.imageinfo?.[0];
      if (!image) return [];

      const artistHtml = image.extmetadata?.Artist?.value || "";
      const artist = new DOMParser()
        .parseFromString(artistHtml, "text/html")
        .body.textContent?.trim();

      return [{
        id: String(page.pageid),
        urls: { regular: image.thumburl || image.url },
        alt_description: page.title.replace(/^File:/i, "").replace(/_/g, " "),
        description: page.title.replace(/^File:/i, "").replace(/_/g, " "),
        user: { name: artist || "Wikimedia Commons contributor" },
        links: { html: page.fullurl || image.descriptionurl }
      }];
    });

    setPhotos(results);
    setTotalPages(Math.max(1, Math.min(
      Math.ceil((data.query?.searchinfo?.totalhits || results.length) / RESULTS_PER_PAGE),
      100
    )));
    setUsingCommons(true);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      return;
    }

    setPage(1);
    setSubmittedQuery(cleanQuery);
  }

  function goToPreviousPage() {
    setPage((current) => Math.max(1, current - 1));
  }

  function goToNextPage() {
    setPage((current) => Math.min(totalPages, current + 1));
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-content">
       
          <h1>Find beautiful images</h1>
          <p className="subtitle">
            Search free photos from Unsplash and Wikimedia Commons.
          </p>

          <form className="search-form" onSubmit={handleSubmit}>
            <Search size={21} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for mountains, food, cars..."
              aria-label="Search images"
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main className="content">
        <div className="results-header">
          <div>
            <p className="results-label">SEARCH RESULTS</p>
            <h2>{submittedQuery}</h2>
          </div>
          {!loading && !error && photos.length > 0 && (
            <span className="page-info">Page {page} of {totalPages}</span>
          )}
        </div>

        {!loading && !error && usingCommons && (
          <p className="provider-notice">
            Showing free, attributed Wikimedia Commons results because Unsplash access is unavailable.
          </p>
        )}

        {loading && <LoadingGrid />}

        {!loading && error && (
          <section className="state-card error-card">
            <ImageOff size={40} />
            <h3>Unable to load images</h3>
            <p>{error}</p>
            <button
              className="retry-button"
              onClick={() => fetchPhotos(submittedQuery, page)}
            >
              Try again
            </button>
          </section>
        )}

        {!loading && !error && photos.length === 0 && (
          <section className="state-card">
            <ImageOff size={40} />
            <h3>No images found</h3>
            <p>Try searching with a different keyword.</p>
          </section>
        )}

        {!loading && !error && photos.length > 0 && (
          <>
            <section className="image-grid" aria-label="Image search results">
              {photos.map((photo) => (
                <article className="image-card" key={photo.id}>
                  <img
                    src={photo.urls.regular}
                    alt={photo.alt_description || photo.description || `Photo by ${photo.user.name}`}
                    loading="lazy"
                  />

                  <div className="image-overlay">
                    <div className="image-details">
                      <p className="photo-title">
                        {photo.description || photo.alt_description || "Untitled photo"}
                      </p>
                      <p>{usingCommons ? "Contributor" : "Photo by"} {photo.user.name}</p>
                      {photo.user.location && <p>{photo.user.location}</p>}
                      <a
                        href={photo.links.html}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View on {usingCommons ? "Wikimedia Commons" : "Unsplash"}
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <nav className="pagination" aria-label="Pagination">
              <button
                onClick={goToPreviousPage}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <span>{page}</span>

              <button
                onClick={goToNextPage}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </nav>
          </>
        )}
      </main>

      <footer>
        <p>
          Images provided by{" "}
          <a
            href={usingCommons ? "https://commons.wikimedia.org/" : "https://unsplash.com/"}
            target="_blank"
            rel="noreferrer"
          >
            {usingCommons ? "Wikimedia Commons" : "Unsplash"}
          </a>
        </p>
      </footer>
    </div>
  );
}

function LoadingGrid() {
  return (
    <section className="image-grid" aria-label="Loading images" aria-busy="true">
      {Array.from({ length: RESULTS_PER_PAGE }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-image" />
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
        </div>
      ))}
      <div className="loading-message">
        <LoaderCircle className="spinner" size={24} />
        Loading images...
      </div>
    </section>
  );
}

export default App;