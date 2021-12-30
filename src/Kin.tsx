import { useState, useEffect } from 'react'
import axios from 'axios'
import './Kin.scss'

interface Input{
  name: string;
  value: string;
  options?: string[];
  type?: string;
  onChange: (arg: string) => void;
}
interface KinActionProps{
    title: string;
    actionName: string;
    action: () => void;
    inputs?: Input[];
}
function KinAction({
    title,
    actionName,
    action,
    inputs ,
}:KinActionProps) {
    return (
      <>
        <div className="Kin-action-title">
          {title}
        </div>
        <div className="Kin-action">
          {inputs?.length ? inputs.map(({
          type = 'text', name, value, options, onChange,
          }) => (
            <div key={name} className="Kin-action-input-container">
              <label htmlFor={`Kin-action-for-${name}`} className="Kin-action-label">
                {name}
              </label>
              {options?.length ? (
                <select id={`Kin-action-for-${name}`} className="Kin-action-input">
                  {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
) : (<input onChange={(event) => onChange(event.target.value)} type={type} value={value} id={`Kin-action-for-${name}`} />)}

            </div>
          )) : null}
          <button type="button" className="Kin-action-button" onClick={action}>
            {actionName}
          </button>
        </div>
      </>
) }

interface Response{
    data: string;
    status: number;
}

interface ClientReponse {
  status: number;
  data: {
    appIndex?: number
  }
}

interface CheckServerRunning{
    onSuccess: (arg: ClientReponse) => void;
    onFailure: (arg: any) => void;
  }
  async function checkServerRunning({ onSuccess, onFailure }:CheckServerRunning) {
    try {
      const baseUrl = process.env.REACT_APP_SERVER_URL
      if(!baseUrl) throw new Error("No URL");

      const url = `${baseUrl}/healthcheck`
      const response:ClientReponse = await axios.get(url)
      onSuccess(response)
    } catch (error) {
      onFailure(error)
    }
  }
interface HandleSetupKinClient{
    onSuccess: () => void;
    onFailure: (arg: any) => void;
    kinEnvironment: string;
    appIndex: string;
  }
  async function handleSetupKinClient({
    onSuccess, onFailure, kinEnvironment, appIndex,
  }:HandleSetupKinClient) {
    try {
      const baseUrl = process.env.REACT_APP_SERVER_URL
      if(!baseUrl) throw new Error("No URL");

      const url = `${baseUrl}/setup?env=${kinEnvironment}&appIndex=${appIndex}`
      const response:Response = await axios.post(url)

      if(response.status === 201) {
        onSuccess()
      } else {
        throw new Error("No appIndex");
      }
    } catch (error) {
      onFailure(error)
    }
  }

  interface HandleCreateAccount{
      onSuccess: (arg: string) => void;
      onFailure: (arg: any) => void;
  }

  async function handleCreateAccount({ onSuccess, onFailure }:HandleCreateAccount) {
      try {
          const baseUrl = process.env.REACT_APP_SERVER_URL
          if(!baseUrl) throw new Error("No URL");

          const url = `${baseUrl}/account`
          const response:Response = await axios.post(url)
          onSuccess(response.data)
      } catch (error) {
          onFailure(error)
      }
  }

function Kin() {
    const [serverRunning, setServerRunning] = useState(false)
    const [serverAppIndex, setServerAppIndex] = useState(0)
    const [shouldUpdate, setShouldUpdate] = useState(true)
    useEffect(() => {
      if(shouldUpdate) {
        checkServerRunning({
              onSuccess: ({ status, data }) => {
                setServerRunning(status === 200)
                setServerAppIndex(data?.appIndex || 0)
              },
              onFailure: () => setServerRunning(false),
          })

          setShouldUpdate(false)
      }
    }, [shouldUpdate])
    const [kinEnvironment, setKinEnvironment] = useState('Test')
    const [appIndex, setAppIndex] = useState('')

    // const [users, setUsers] = useState([])

    return (
      <div className="Kin">
        <div className={`Kin-status ${serverRunning ? 'up' : 'down'}`}>
          {serverRunning ? `Server Running ${serverAppIndex ? ` - Kin App Index = ${serverAppIndex}` : ' but Client not instantiated :('}` : 'Server Not Running'}
        </div>
        {serverRunning ? (
          <>
            <KinAction
              title="Setup Your Kin Client"
              actionName="Setup"
              action={() => { handleSetupKinClient({
                  onSuccess: () => setShouldUpdate(true),
                  onFailure: (error) => console.log(error),
                  kinEnvironment,
                  appIndex,
              }) }}
              inputs={[
                {
                  name: 'Environment', value: kinEnvironment, options: ['Test', 'Prod'], onChange: setKinEnvironment,
                },
               {
                  name: 'App Index', value: appIndex, type: 'number', onChange: setAppIndex,
                }]}
            />
            {serverAppIndex ? (
              <>
                <KinAction
                  title="Create a Kin Account"
                  actionName="Create"
                  action={() => { handleCreateAccount({
                  onSuccess: (data) => console.log(data),
                  onFailure: (error) => console.log(error),
              }) }}
                />
                <KinAction
                  title="Get Account Balance"
                  actionName="Get"
                  action={() => { console.log('click!') }}
                />
                <KinAction
                  title="Request Airdrop"
                  actionName="Request"
                  action={() => { console.log('click!') }}
                />
                <KinAction
                  title="Send Kin"
                  actionName="Send"
                  action={() => { console.log('click!') }}
                />
              </>
) : null}
          </>
) : null}

      </div>
    )
}

export default Kin
