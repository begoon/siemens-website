import classes from './App.module.css';
import { useState, useEffect } from 'react';
import * as api from './services/Controllers';
import Controller from './components/Controller/Controller';
import NewController from './components/NewController/NewController'
import Status from './components/Status/Status'
import Spinner from './components/Spinner/Spinner';

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
      {loading ? <Spinner /> : null}
      {error ? <p>{error}</p> : null}
      <button onClick={refresh}>Refresh</button>
      <a href="demo/" target="_blank" style={{ marginLeft: '10px' }}>
        Demo application
      </a>
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
        <NewController create={createController} />
        <hr />
        <Status />
      </div>
    </>
  );
}

export default App;
