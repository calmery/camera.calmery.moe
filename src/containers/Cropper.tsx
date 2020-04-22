import React from "react";
import { connect } from "react-redux";
import { State } from "~/domains";

const mapStateToProps = ({ cropper }: State) => cropper;
const mapDispatchToProps = () => ({});

class Cropper extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => {
    return <div>Hello World</div>;
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Cropper);
