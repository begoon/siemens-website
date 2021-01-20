import classes from './App.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react';
import * as api from './services/Controllers';

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
  const controller = args.controller;

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
    api.saveVariable(controller, name, value, () => {
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
    api.deleteVariable(controller, name, () => {
      const updatedVariables = { ...variables };
      delete updatedVariables[name];
      setVariables(updatedVariables);
    }, () => {
      setUpdatingVariable(null);
    });
  };

  const buildVariableRow = (name) => {
    if (!name) return;
    const id = `${controller}-${name}`;
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

  const buildNewVariableRow = () => {
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
            Object.keys(variables).map((variable) => buildVariableRow(variable))
          }
          {
            buildNewVariableRow()
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
