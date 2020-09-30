import React from "react";
import { uploadFiles, downloadFiles, getStatus } from "./actions";
import { Spinner } from "./Spinner";

class Pipeline extends React.Component {
  constructor() {
    super();
    this.state = { showFileSelect: true };
  }

  handleSelectFile = () => {
    document.getElementById("myfile").click();
  };

  handleSelectFileChange = () => {
    this.setState({
      fileName: document.getElementById("myfile").files[0].name,

      showUploadButton: true,
      showFileSelectedNoifier: true,
    });
  };

  handleUploadFilesPress = async () => {
    const response = await uploadFiles();
    this.setState({
      showUploadNotifier: true,
      showStatusNotifier: true,
      showSpinner: true,
      uploadMessage: response.data.message,
      showFileSelect: false,
      showUploadButton: false,
    });

    if (!this.state.pollingStatus) {
      this.pollStatus();
    }
  };

  pollStatus = async () => {
    this.setState({ pollingStatus: true });

    const response = await getStatus();
    this.setState({ status: response.data.status });

    if (response.data.status !== "Ready") {
      setTimeout(this.pollStatus, 1000);
    }

    if (response.data.status === "Ready") {
      this.setState({ downloadAvailable: true, showSpinner: false });
    }
  };

  render() {
    return (
      <>
        <input
          type="file"
          id="myfile"
          name="myfile"
          accept="video/mp4"
          style={{ display: "none" }}
          onChange={this.handleSelectFileChange}
          multiple
        ></input>

        {this.state.showFileSelect && (
          <button onClick={this.handleSelectFile}>Select File</button>
        )}
        {this.state.showFileSelectedNoifier && <h2>{this.state.fileName}</h2>}
        {this.state.showUploadButton && (
          <button onClick={async () => await this.handleUploadFilesPress()}>
            Upload File
          </button>
        )}
        {this.state.showUploadNotifier && <h2>{this.state.uploadMessage}</h2>}
        {this.state.showStatusNotifier && <h2>Status: {this.state.status}</h2>}
        {this.state.showSpinner && <Spinner></Spinner>}
        {this.state.downloadAvailable && (
          <button onClick={downloadFiles}>Download File</button>
        )}
      </>
    );
  }
}

export default Pipeline;
