import classes from './App.module.css';
import { useState, useEffect } from 'react';
import * as api from './services/Controllers';
import Controller from './components/Controller';
import NewController from './components/NewController'

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
