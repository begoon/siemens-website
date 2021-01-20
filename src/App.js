import classes from './App.module.css';
import { useState, useEffect } from 'react';
import * as api from './services/Controllers';
import Controllers from './components/Controller';

const App = () => {
  const [controllers, setControllers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(controllers).length || loading) return;
    setLoading(true);
    api.loadControllers((response) => {
      setControllers(response);
      setError('');
    }, () => {
      setLoading(false);
    }, (path) => {
      setError(`Unable to load controllers from ${path}. Re-try in 5 seconds...`);
      setTimeout(() => setLoading(false), 5000);
    });
  }, [controllers, loading, error]);

  return (
    <>
      {error ? <p>{error}</p> : ''}
      {loading ? <p>Loading...</p> : ''}
      <div className={classes.App}>
        {
          Object.keys(controllers).map(
            (controller) => <Controllers
              key={controller}
              controller={controller}
              variables={controllers[controller]}
            />
          )
        }
      </div>
    </>
  );
}

export default App;
