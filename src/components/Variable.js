import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashAlt, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

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

export { VariableRow, NewVariableRow };
