import React from "react";
import { connect } from "react-redux";

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

class Canvas extends React.Component<
  ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>
> {
  public render = () => <div />;
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
