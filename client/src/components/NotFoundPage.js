import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';

export default () => (
  <div className="notFoundBox">
    <FontAwesome name="fas fa-exclamation" size="5x" />
    <h2>Wrong page</h2>
    <Link to="/" class="link">
      <h4>go home</h4>
    </Link>
  </div>
);
