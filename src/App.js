import classes from './App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import $ from 'jquery';
import { useState, useEffect } from 'react';

// const host = "http://127.0.0.1:5000";
const host = "https://siemens-controller.herokuapp.com";

const request = (url, complete, always, failed) => {
  const path = host + "/" + url;
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

const VariableRow = (args) => {
  return (
    <tr>
      <td>{args.name}</td>
      <td>
        <input value={args.value} onChange={args.update} />
      </td>
      <td>
        <button>
          {
            args.updating ?
              <FontAwesomeIcon icon={faSyncAlt} className="fa-spin" /> :
              <FontAwesomeIcon icon={faSave} onClick={args.save} />
          }
        </button>
      </td>
      <td>
        <button>
          <FontAwesomeIcon icon={faTrashAlt} onClick={args.delete} />
        </button>
      </td>
    </tr>
  );
}

const NewVariableRow = (args) => {
  return (
    <tr>
      <td>
        <input value={args.name} onChange={args.updateName} placeholder="new name" />
      </td>
      <td>
        <input value={args.value} onChange={args.updateValue} placeholder="value" />
      </td>
      <td>
        <button>
          {
            args.updating ?
              <FontAwesomeIcon icon={faSyncAlt} className="fa-spin" /> :
              <FontAwesomeIcon icon={faSave} onClick={args.save} />
          }
        </button>
      </td>
      <td>
      </td>
    </tr>
  );
}

const Controllers = (args) => {
  const [updatingVariable, setUpdatingVariable] = useState(null);
  const [variables, setVariables] = useState({ ...args.variables });
  const [newVariable, setNewVariable] = useState({ name: '', value: '' });

  const updateVariable = (variableName, event) => {
    let updatedVariables = { ...variables };
    updatedVariables[variableName] = event.target.value;
    setVariables(updatedVariables);
  };

  const updateNewVariable = (event, field) => {
    const updatedNewVariable = { ...newVariable };
    updatedNewVariable[field] = event.target.value;
    setNewVariable(updatedNewVariable);
  }

  const saveVariable = (id, name, value, isNew) => {
    if (updatingVariable || !name) return;
    setUpdatingVariable(id);
    const path = `controller/${args.controller}/variable/set?${name}=${value}`
    request(path, () => {
      const updatedVariables = { ...variables };
      updatedVariables[name] = value;
      setVariables(updatedVariables);
      if (isNew) setNewVariable({ name: '', value: '' });
    }, () => {
      setUpdatingVariable(null);
    });
  };

  const deleteVariable = (id, name) => {
    if (updatingVariable) return;
    setUpdatingVariable(id);
    const path = `controller/${args.controller}/variable/delete?${name}`
    request(path, () => {
      const updatedVariables = { ...variables };
      delete updatedVariables[name];
      setVariables(updatedVariables);
    }, () => {
      setUpdatingVariable(null);
    });
  };

  const variableRow = (name) => {
    if (!name) return;
    const id = `${args.controller}-${name}`;
    const value = variables[name];
    return (
      <VariableRow
        key={id}
        name={name}
        value={value}
        updating={updatingVariable === id}
        update={(event) => updateVariable(name, event)}
        save={() => saveVariable(id, name, value)}
        delete={(event) => deleteVariable(id, name, event)}
      />
    );
  }

  const newVariableRow = (controller, newVariable) => {
    const id = `${controller}@new_variable`;
    const name = newVariable.name;
    const value = newVariable.value;
    return (
      <NewVariableRow
        key={id}
        name={name}
        value={value}
        updating={updatingVariable === id}
        save={() => saveVariable(id, name, value, true)}
        updateName={(event) => updateNewVariable(event, 'name')}
        updateValue={(event) => updateNewVariable(event, 'value')}
      />
    );
  }

  return (
    <>
      <h1>{args.controller}</h1>
      <table className="pure-table">
        <thead>
          <tr key="a">
            <td>Variable</td>
            <td>Value</td>
            <td>Save</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(variables).map((variable) => variableRow(variable))
          }
          {
            newVariableRow(args.controller, newVariable)
          }
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
