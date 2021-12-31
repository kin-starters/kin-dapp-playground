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
    displayValue?: string;
    disabled?: boolean
}
function KinAction({
    title,
    actionName,
    action,
    inputs,
    displayValue,
    disabled = false,
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
                <select id={`Kin-action-for-${name}`} className="Kin-action-input" value={value} onChange={(event) => onChange(event.target.value)}>
                  {options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
) : (<input onChange={(event) => onChange(event.target.value)} type={type} value={value} id={`Kin-action-for-${name}`} className="Kin-action-input" />)}

            </div>
          )) : null}
          {displayValue ? (<p>{displayValue}</p>) : null}
          <button type="button" className={`Kin-action-button ${disabled ? 'disabled' : 'enabled'}`} onClick={action}>
            {actionName}
          </button>
        </div>
      </>
) }

interface Response{
    data: string;
    status: number;
}
interface StatusResponse{
    data: {
      appIndex: number,
      users: string[]
    };
    status: number;
}
interface BalanceResponse{
    data: number;
    status: number;
}

interface CheckServerRunning{
    onSuccess: (arg: StatusResponse) => void;
    onFailure: (arg: any) => void;
  }
  async function checkServerRunning({ onSuccess, onFailure }:CheckServerRunning) {
    try {
      const baseUrl = process.env.REACT_APP_SERVER_URL
      if(!baseUrl) throw new Error("No URL");

      const url = `${baseUrl}/status`
      const response:StatusResponse = await axios.get(url)
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
      name: string,
      onSuccess: () => void;
      onFailure: (arg: any) => void;
  }

  async function handleCreateAccount({ onSuccess, onFailure, name }:HandleCreateAccount) {
      try {
          const baseUrl = process.env.REACT_APP_SERVER_URL
          if(!baseUrl) throw new Error("No URL");

          const url = `${baseUrl}/account?name=${name}`
          await axios.post(url)
          onSuccess()
      } catch (error) {
          onFailure(error)
      }
  }
  interface HandleGetBalance{
      name: string,
      onSuccess: (arg: number) => void;
      onFailure: (arg: any) => void;
  }

  async function handleGetBalance({ onSuccess, onFailure, name }:HandleGetBalance) {
      try {
          const baseUrl = process.env.REACT_APP_SERVER_URL
          if(!baseUrl) throw new Error("No URL");

          const url = `${baseUrl}/balance?name=${name}`
          const response: BalanceResponse = await axios.get(url)
          onSuccess(response.data)
      } catch (error) {
          onFailure(error)
      }
  }

function Kin() {
    const [serverRunning, setServerRunning] = useState(false)
    const [serverAppIndex, setServerAppIndex] = useState(0)
    const [userAccounts, setUserAccounts] = useState<string[]>([])
    const [shouldUpdate, setShouldUpdate] = useState(true)
    useEffect(() => {
      if(shouldUpdate) {
        checkServerRunning({
              onSuccess: ({ status, data }) => {
              console.log("🚀 ~ status, data", status, data)
                setServerRunning(status === 200)
                setServerAppIndex(data.appIndex)
                setUserAccounts(data.users)
              },
              onFailure: () => setServerRunning(false),
          })

          setShouldUpdate(false)
      }
    }, [shouldUpdate])
    const [kinEnvironment, setKinEnvironment] = useState('Test')
    const [appIndex, setAppIndex] = useState('')
    const [newUserName, setNewUserName] = useState('')
    const [balanceUser, setBalanceUser] = useState('')
    const [displayBalance, setDisplayBalance] = useState('')

    return (
      <div className="Kin">
        <div className={`Kin-status ${serverRunning ? 'up' : 'down'}`}>
          {serverRunning ? `Server Running ${serverAppIndex ? ` : App Index - ${serverAppIndex}` : ' but Client not instantiated :('}` : 'Server Not Running'}
        </div>
        {(() => {
          if(serverRunning) {
            return (
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
                },
              ]}
              />
            )
          }
            return null
        })()}

        {(() => {
          if(serverAppIndex) {
            return (
              <KinAction
                title="Create a Kin Account"
                actionName="Create"
                action={() => { handleCreateAccount({
                  name: newUserName,
                      onSuccess: () => {
                        setShouldUpdate(true)
                        setNewUserName('')
                      },
                      onFailure: (error) => console.log(error),
                  }) }}
                inputs={[
                    {
                      name: 'Name', value: newUserName, onChange: setNewUserName,
                    },
                  ]}
              />
            )
          }
            return null
        })()}

        {(() => {
          if(serverAppIndex && userAccounts.length > 0) {
            console.log("🚀 ~ balanceUser", balanceUser)
            return (
              <>
                <KinAction
                  title="Get Account Balance"
                  actionName="Get"
                  action={() => { handleGetBalance({
                      name: balanceUser || userAccounts[0],
                      onSuccess: (balance) => {
                        setDisplayBalance((balance.toString()))
                      },
                      onFailure: (error) => console.log(error),
                  }) }}
                  inputs={[
                    {
                      name: 'User',
                      value: balanceUser || userAccounts[0],
                      options: userAccounts,
                      onChange: (user) => {
                          setBalanceUser(user)
                          setDisplayBalance('')
                      },
                    },
                  ]}
                  displayValue={displayBalance ? `${balanceUser || userAccounts[0]} has ${displayBalance} Kin` : ''}
                  disabled={!balanceUser && !userAccounts[0]}
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
            )
          }
            return null
        })()}

      </div>
    )
}

export default Kin
