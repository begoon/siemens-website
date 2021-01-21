import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSyncAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons'

import classes from './Controller.module.css';

import { useEffect, useState } from 'react';
import * as api from '../../services/Controllers';
import { VariableRow, NewVariableRow } from '../Variable/Variable';

const Controller = (args) => {
  const [processing, setProcessing] = useState(false);

  const [variables, setVariables] = useState({ ...args.variables });
  const [newVariable, setNewVariable] = useState({ name: '', value: '' });

  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (deleted) {
      args.delete(controller);
    }
  });

  const controller = args.controller;

  const updateVariable = (variableName, event) => {
    const updatedVariables = { ...variables };
    updatedVariables[variableName] = event.target.value;
    setVariables(updatedVariables);
  };

  const updateNewVariable = (event, field) => {
    const updatedNewVariable = { ...newVariable };
    updatedNewVariable[field] = event.target.value;
    setNewVariable(updatedNewVariable);
  }

  const saveVariable = (id, name, value, isNew) => {
    if (processing || !name) return;
    setProcessing(id);
    api.saveVariable(controller, name, value, () => {
      const updatedVariables = { ...variables };
      updatedVariables[name] = value;
      setVariables(updatedVariables);
      if (isNew) setNewVariable({ name: '', value: '' });
    }, () => {
      setProcessing(false);
    });
  };

  const deleteVariable = (id, name) => {
    if (processing) return;
    setProcessing(id);
    api.deleteVariable(controller, name, () => {
      const updatedVariables = { ...variables };
      delete updatedVariables[name];
      setVariables(updatedVariables);
    }, () => {
      setProcessing(false);
    });
  };

  const deleteController = () => {
    if (processing) return;
    setProcessing('@');
    api.deleteController(controller, () => {
      setDeleted(controller);
    }, () => {
      setProcessing(false);
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
        updating={processing === id}
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
        updating={processing === id}
        save={() => saveVariable(id, name, value, true)}
        updateName={(event) => updateNewVariable(event, 'name')}
        updateValue={(event) => updateNewVariable(event, 'value')}
      />
    );
  }

  return (
    <div className={classes.Controller}>
      <div className={classes.Title}>
        <span className={classes.Name}>{controller}</span>
        {
          processing === `@` ?
            <FontAwesomeIcon
              icon={faSyncAlt} className="fa-spin" size="xs" /> :
            <FontAwesomeIcon
              icon={faTrashAlt} size="xs"
              onClick={deleteController}
            />
        }
      </div>
      <table className="pure-table">
        <thead>
          <tr>
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
    </div>
  );
}

export default Controller;
