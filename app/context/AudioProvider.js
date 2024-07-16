import React, { Component, createContext } from 'react'
import { Alert } from 'react-native'
import * as MediaLibrary from 'expo-media-library'

export const AudioContext = createContext()
export class AudioProvider extends Component {
    constructor(props){
        super(props)
        this.state = {
            audioFiles: [],
        }
    }

    permissionAllert = () => {
        Alert.alert("Permission Required", "This app needs to read audio files!", 
            [
                {
            text: "Yes",
            onPress: () => this.getPermission()
        },{
            text:"Canceled",
            onPress: () => this.permissionAllert()
        },
    ])
    }

    getAudioFiles = async () => {
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
        })
        media = await MediaLibrary.getAssetsAsync({
            mediaTypes: 'audio',
            first: media.totalCount,
        })
        this.setState({ ...this.state, audioFiles: media.assets,
        })
    }

    getPermission = async () => {

        // {
        //     "accessPrivileges": "none", 
        //     "canAskAgain": true, 
        //     "expires": "never", 
        //     "granted": false, 
        //     "status": "undetermined"
        // }

        const permission = await MediaLibrary.getPermissionsAsync()
        if(permission.granted){
            this.getAudioFiles()
        }
        if(!permission.granted && permission.canAskAgain){
           const {
            status,
            canAskAgain,
            } = await MediaLibrary.requestPermissionsAsync()
            if(status === 'denied' && canAskAgain){
                this.permissionAllert()
            }
            if(status === 'granted'){
                this.getAudioFiles()
            }
            if(status === 'denied' && !canAskAgain){
           
            }
    }
}
    componentDidMount() {
        this.getPermission()
    }
  render() {
    return (
        <AudioContext.Provider value={{ audioFiles: this.state.audioFiles }}>
        {this.props.children}
    </AudioContext.Provider>
    )
  }
}

export default AudioProvider
