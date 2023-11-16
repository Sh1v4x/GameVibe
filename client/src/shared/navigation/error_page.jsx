import React from "react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Désolé, une erreur inattendue s'est produite.</p>
      <Link to="/">
        Retourner à l'accueil
      </Link>
    </div>
  );
}
