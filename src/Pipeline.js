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
    });
    this.setState({ showUploadButton: true });
    this.setState({ showFileSelectedNoifier: true });
  };

  handleUploadFilesPress = async () => {
    const response = await uploadFiles();
    this.setState({ showUploadNotifier: true });
    this.setState({ showStatusNotifier: true });
    this.setState({ showSpinner: true });
    this.setState({ uploadMessage: response.data.message });
    this.setState({ showFileSelect: false });
    this.setState({ showUploadButton: false });

    if (!this.state.pollingStatus) {
      this.pollStatus();
    }
  };

  pollStatus = async () => {
    this.setState({ pollingStatus: true });

    const response = await getStatus();
    this.setState({ status: response.data.status });
    console.log("polling");

    console.log(response.data.status);

    if (response.data.status !== "Ready") {
      setTimeout(this.pollStatus, 1000);
    }

    if (response.data.status === "Ready") {
      this.setState({ downloadAvailable: true });
      this.setState({ showSpinner: false });
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
