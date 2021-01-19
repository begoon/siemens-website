import classes from './App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import { useState, useEffect } from 'react';

// const host = "http://127.0.0.1:5000";
const host = "https://siemens-controller.herokuapp.com";

const request = (url, complete, always, failed) => {
  const path = host + "/" + url;
  console.log('> request: ' + path);
  $.get(path,
    (response) => {
      if (complete) complete(response);
    })
    .always(() => {
      if (always) always();
    })
    .fail(() => {
      if (failed) failed(path);
    });
}

const TableRow = (args) => {
  return (
    <tr>
      <td>{args.variable}</td>
      <td>
        <input value={args.value} onChange={args.updateVariable} />
      </td>
      <td>
        {
          args.updating ?
            <FontAwesomeIcon icon={faSyncAlt} className="fa-spin" /> :
            <FontAwesomeIcon icon={faSave} onClick={args.saveVariable} />
        }
      </td>
      <td>
        <FontAwesomeIcon icon={faTrashAlt} />
      </td>
    </tr>
  );
}

const MainTable = (args) => {
  const [updatingVariable, setUpdatingVariable] = useState(null);
  const [variables, setVariables] = useState({ ...args.variables });

  const saveVariable = (id) => {
    if (updatingVariable !== null) return;
    setUpdatingVariable(id);
    request("controller", null, () => setUpdatingVariable(null));
  };

  const updateVariable = (controller, variable, event) => {
    console.log(`${controller} ${variable} ${event.target.value}`);
    let updatedVariables = { ...variables };
    updatedVariables[variable] = event.target.value;
    setVariables(updatedVariables);
  };
  return (
    <>
      <h1>{args.controller}</h1>
      <table className="pure-table">
        <thead>
          <tr key="a">
            <td>Variable</td>
            <td>Value</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(variables).map(
              (variable) => <TableRow
                key={args.controller + '-' + variable}
                id={args.controller + '-' + variable}
                variable={variable}
                value={variables[variable]}
                updating={updatingVariable === variable}
                saveVariable={
                  () => saveVariable(
                    args.controller + '-' + variable
                  )}
                updateVariable={
                  (event) => updateVariable(
                    args.controller, variable, event,
                  )
                }
              />
            )}
        </tbody>
      </table>
    </>
  );
}

const App = () => {
  const [controllers, setControllers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Object.keys(controllers).length !== 0) return;
    if (loading) return;
    setLoading(true);
    request('controller', (response) => {
      console.log(response);
      setControllers(response);
      setError('');
      setLoading(false);
    }, () => {
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
            (controller) => <MainTable
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
