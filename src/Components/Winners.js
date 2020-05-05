import React, {PureComponent} from "react"

class Winners extends PureComponent
{
    render()
    {
        return (
            <div className="winners-cont">

                <div className="winners-section">
                    <div className="winners-day">برندگان شب اول، 6 اردیبهشت</div>
                    <div className="phone-direction">
                        <div>091091***69</div>
                        <div>091962***99</div>
                        <div>091244***75</div>
                        <div>091924***95</div>
                    </div>
                </div>

                <div className="winners-section">
                    <div className="winners-day">برندگان شب دوم، 7 اردیبهشت</div>
                    <div className="phone-direction">
                        <div>093881***38</div>
                        <div>093854***99</div>
                        <div>090355***93</div>
                        <div>091647***84</div>
                    </div>
                </div>

            </div>
        )
    }
}

export default Winners