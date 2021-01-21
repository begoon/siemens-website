import classes from './App.module.css';
import { useState, useEffect } from 'react';
import * as api from './services/Controllers';
import Controller from './components/Controller/Controller';
import NewController from './components/NewController/NewController'

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
      setLoading(false);
    }, () => {
    }, (error) => {
      setError(`${error.error}. Re-try in 5 seconds...`);
      setError(`${error.error}. Re-try in 5 seconds...`);
      setTimeout(() => setLoading(false), 5000);
    });
  }, [controllers, loading, error]);

  const refresh = () => {
    setControllers({});
  }

  const createController = (name) => {
    const updatedControllers = { ...controllers };
    updatedControllers[name] = {};
    setControllers(updatedControllers);
  }

  const deleteController = (name) => {
    const updatedControllers = { ...controllers };
    delete updatedControllers[name];
    setControllers(updatedControllers);
  }

  return (
    <>
      {error ? <p>{error}</p> : ''}
      {loading ? <p>Loading...</p> : ''}
      <button onClick={refresh}>Refresh</button>
      <h1>Controllers</h1>
      <div className={classes.App}>
        {
          Object.keys(controllers).map(
            (controller) => <Controller
              key={controller}
              controller={controller}
              variables={controllers[controller]}
              delete={deleteController}
            />
          )
        }
      </div>
      <NewController create={createController} />
    </>
  );
}

export default App;
