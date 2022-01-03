import { useState, useEffect } from 'react'
import axios from 'axios'

import { MakeToast } from './interfaces'
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
  interface HandleRequestAirdrop{
      name: string,
      amount: string,
      onSuccess: () => void;
      onFailure: (arg: any) => void;
  }

  async function handleRequestAirdrop({
 onSuccess, onFailure, name, amount,
}:HandleRequestAirdrop) {
      try {
          const baseUrl = process.env.REACT_APP_SERVER_URL
          if(!baseUrl) throw new Error("No URL");

          const url = `${baseUrl}/airdrop?name=${name}&amount=${amount}`
          await axios.post(url)
          onSuccess()
      } catch (error) {
          onFailure(error)
      }
  }

  interface KinProps{
     makeToast: (arg:MakeToast) => void;
     setLoading: (arg: boolean) => void;
  }
function Kin({ makeToast, setLoading }: KinProps) {
    const [serverRunning, setServerRunning] = useState(false)
    const [serverAppIndex, setServerAppIndex] = useState(0)
    const [userAccounts, setUserAccounts] = useState<string[]>([])
    const [shouldUpdate, setShouldUpdate] = useState(true)
    useEffect(() => {
      if(shouldUpdate) {
        checkServerRunning({
              onSuccess: ({ status, data }) => {
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
    const [airdropAmount, setAirdropAmount] = useState('')
    const [airdropUser, setAirdropUser] = useState('')

    return (
      <div className="Kin">
        <div className={`Kin-status ${serverRunning ? 'up' : 'down'}`}>
          {serverRunning ? `Server Running ${serverAppIndex ? ` : App Index ${serverAppIndex}` : ' but Client not instantiated :('}` : 'Server Not Running'}
        </div>
        {(() => {
          if(serverRunning) {
            return (
              <KinAction
                title="Setup Your Kin Client"
                actionName="Setup"
                action={() => {
                  setLoading(true)
                  handleSetupKinClient({
                  onSuccess: () => {
                    setLoading(false)
                    makeToast({ text: `Connected to App Index ${serverAppIndex}!`, happy: false })
                    setShouldUpdate(true) },
                  onFailure: (error) => {
                    setLoading(false)
                    console.log(error) },
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
                action={() => {
                  setLoading(true)
                  handleCreateAccount({
                      name: newUserName,
                      onSuccess: () => {
                        setLoading(false)
                        makeToast({ text: 'Account Creation Successful!', happy: true })
                        setShouldUpdate(true)
                        setNewUserName('')
                      },
                      onFailure: (error) => {
                        setLoading(false)
                        makeToast({ text: 'Account Creation Failed!', happy: false })
                        console.log(error) },
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
            return (
              <>
                <KinAction
                  title="Get Account Balance"
                  actionName="Get"
                  action={() => {
                    setLoading(true)
                    handleGetBalance({
                      name: balanceUser || userAccounts[0],
                      onSuccess: (balance) => {
                        setLoading(false)
                        setDisplayBalance((balance.toString()))
                      },
                      onFailure: (error) => {
                        setLoading(false)
                        console.log(error) },
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
                {kinEnvironment === 'Test' ? (
                  <KinAction
                    title="Request Airdrop (Test Network Only)"
                    actionName="Request"
                    action={() => {
                      setLoading(true)
                      handleRequestAirdrop({
                      name: airdropUser || userAccounts[0],
                      amount: airdropAmount,
                      onSuccess: () => {
                        setLoading(false)
                        makeToast({ text: 'Airdrop Successful!', happy: true })
                      },
                      onFailure: (error) => {
                        setLoading(false)
                        makeToast({ text: 'Airdrop Failed!', happy: false })
                        console.log(error) },
                  }) }}
                    inputs={[
                    {
                      name: 'User',
                      value: airdropUser || userAccounts[0],
                      options: userAccounts,
                      onChange: (user) => {
                          setAirdropUser(user)
                      },
                    },
                    {
                  name: 'Requested Amount', value: airdropAmount, type: 'number', onChange: setAirdropAmount,
                },
                  ]}
                  />
                ) : null}
                <KinAction
                  title="Send Kin"
                  actionName="Send"
                  action={() => {
                      setLoading(true)
                      handleRequestAirdrop({
                      name: airdropUser || userAccounts[0],
                      amount: airdropAmount,
                      onSuccess: () => {
                        setLoading(false)
                        makeToast({ text: 'Airdrop Successful!', happy: true })
                      },
                      onFailure: (error) => {
                        setLoading(false)
                        makeToast({ text: 'Airdrop Failed!', happy: false })
                        console.log(error) },
                  }) }}
                  inputs={[
                    {
                      name: 'User',
                      value: airdropUser || userAccounts[0],
                      options: userAccounts,
                      onChange: (user) => {
                          setAirdropUser(user)
                      },
                    },
                    {
                  name: 'Requested Amount', value: airdropAmount, type: 'number', onChange: setAirdropAmount,
                },
                  ]}
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
