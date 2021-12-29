import { useState, useEffect } from 'react'
import axios from 'axios'
import './Kin.scss'

interface KinActionProps{
    title: string;
    actionName: string;
    action: () => void;
}
function KinAction({
    title,
    actionName,
    action,
}:KinActionProps) {
    return (
      <>
        <div className="Kin-action-title">
          {title}
        </div>
        <div className="Kin-action">
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

interface CheckServerRunning{
    onSuccess: (arg: number) => void;
    onFailure: (arg: any) => void;
}
async function checkServerRunning({ onSuccess, onFailure }:CheckServerRunning) {
    try {
        const baseUrl = process.env.REACT_APP_SERVER_URL
        if(!baseUrl) throw new Error("No URL");

        const url = `${baseUrl}/healthcheck`
        const response:Response = await axios.get(url)
        onSuccess(response.status)
    } catch (error) {
        onFailure(error)
    }
}

function Kin() {
    const [serverRunning, setServerRunning] = useState(false)
    useEffect(() => {
        checkServerRunning({
              onSuccess: (response) => {
                  if(response === 200) {
                      setServerRunning(true)
                  } else {
                      setServerRunning(false)
                  }
              },
              onFailure: () => setServerRunning(false),
          })
    }, [])
    // const [users, setUsers] = useState({})

    return (
      <div className="Kin">
        <div className={`Kin-status ${serverRunning ? 'up' : 'down'}`}>
          {serverRunning ? 'Server Running' : 'Server Not Running'}
        </div>
        {serverRunning ? (
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

      </div>
    )
}

export default Kin
