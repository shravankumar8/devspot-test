const SignupsByLocation = () => {
  return (
    <div className="p-6 bg-secondary-bg rounded-2xl overflow-y-scroll h-[360px] border border-black-terciary">
      <header className="flex justify-between items-center">
        <h4 className="text-white font-semibold font-roboto">
          Sign Ups by Location
        </h4>
      </header>

      <div className="mt-4">
        <ul className="flex flex-col gap-4 py-2">
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1157_2617)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 0.36377H13.7143V11.2244H0V0.36377Z"
                    fill="#1A47B8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7143 0.36377V1.91528H32V0.36377H13.7143ZM13.7143 3.4668V5.01831H32V3.4668H13.7143ZM13.7143 6.56983V8.12135H32V6.56983H13.7143ZM13.7143 9.67286V11.2244H32V9.67286H13.7143ZM0 12.7759V14.3274H32V12.7759H0ZM0 15.8789V17.4304H32V15.8789H0ZM0 18.982V20.5335H32V18.982H0ZM0 22.085V23.6365H32V22.085H0Z"
                    fill="#F93939"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.52368 1.91553V3.46704H3.04749V1.91553H1.52368ZM4.5713 1.91553V3.46704H6.09511V1.91553H4.5713ZM7.61892 1.91553V3.46704H9.14273V1.91553H7.61892ZM10.6665 1.91553V3.46704H12.1903V1.91553H10.6665ZM9.14273 3.46704V5.01856H10.6665V3.46704H9.14273ZM6.09511 3.46704V5.01856H7.61892V3.46704H6.09511ZM3.04749 3.46704V5.01856H4.5713V3.46704H3.04749ZM1.52368 5.01856V6.57007H3.04749V5.01856H1.52368ZM4.5713 5.01856V6.57007H6.09511V5.01856H4.5713ZM7.61892 5.01856V6.57007H9.14273V5.01856H7.61892ZM10.6665 5.01856V6.57007H12.1903V5.01856H10.6665ZM1.52368 8.12159V9.6731H3.04749V8.12159H1.52368ZM4.5713 8.12159V9.6731H6.09511V8.12159H4.5713ZM7.61892 8.12159V9.6731H9.14273V8.12159H7.61892ZM10.6665 8.12159V9.6731H12.1903V8.12159H10.6665ZM9.14273 6.57007V8.12159H10.6665V6.57007H9.14273ZM6.09511 6.57007V8.12159H7.61892V6.57007H6.09511ZM3.04749 6.57007V8.12159H4.5713V6.57007H3.04749Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1157_2617">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">6</h5>
              <p className="text-secondary-text text-sm">United States</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_414_26060)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="#249F58"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.0003 3.4668L27.4289 12.0001L16.0003 20.5335L4.57178 12.0001"
                    fill="#FFDA2C"
                  />
                  <path
                    d="M16.0003 17.4304C18.9458 17.4304 21.3337 14.9992 21.3337 12.0001C21.3337 9.00105 18.9458 6.56982 16.0003 6.56982C13.0548 6.56982 10.667 9.00105 10.667 12.0001C10.667 14.9992 13.0548 17.4304 16.0003 17.4304Z"
                    fill="#1A47B8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7146 14.3276V15.8792H15.2384V14.3276H13.7146ZM16.7622 14.3276V15.8792H18.286V14.3276H16.7622Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.1904 9.67285C12.1904 9.67285 15.6403 10.2935 18.1272 11.3764L21.3333 12.7759"
                    fill="white"
                  />
                  <path
                    d="M12.1904 9.67285C12.1904 9.67285 15.6403 10.2935 18.1272 11.3764L21.3333 12.7759"
                    stroke="white"
                    stroke-width="1.45455"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_414_26060">
                    <rect
                      width="32"
                      height="23.2727"
                      fill="white"
                      transform="translate(0 0.36377)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">8</h5>
              <p className="text-secondary-text text-sm">Brazil</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1157_2617)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 0.36377H13.7143V11.2244H0V0.36377Z"
                    fill="#1A47B8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7143 0.36377V1.91528H32V0.36377H13.7143ZM13.7143 3.4668V5.01831H32V3.4668H13.7143ZM13.7143 6.56983V8.12135H32V6.56983H13.7143ZM13.7143 9.67286V11.2244H32V9.67286H13.7143ZM0 12.7759V14.3274H32V12.7759H0ZM0 15.8789V17.4304H32V15.8789H0ZM0 18.982V20.5335H32V18.982H0ZM0 22.085V23.6365H32V22.085H0Z"
                    fill="#F93939"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.52368 1.91553V3.46704H3.04749V1.91553H1.52368ZM4.5713 1.91553V3.46704H6.09511V1.91553H4.5713ZM7.61892 1.91553V3.46704H9.14273V1.91553H7.61892ZM10.6665 1.91553V3.46704H12.1903V1.91553H10.6665ZM9.14273 3.46704V5.01856H10.6665V3.46704H9.14273ZM6.09511 3.46704V5.01856H7.61892V3.46704H6.09511ZM3.04749 3.46704V5.01856H4.5713V3.46704H3.04749ZM1.52368 5.01856V6.57007H3.04749V5.01856H1.52368ZM4.5713 5.01856V6.57007H6.09511V5.01856H4.5713ZM7.61892 5.01856V6.57007H9.14273V5.01856H7.61892ZM10.6665 5.01856V6.57007H12.1903V5.01856H10.6665ZM1.52368 8.12159V9.6731H3.04749V8.12159H1.52368ZM4.5713 8.12159V9.6731H6.09511V8.12159H4.5713ZM7.61892 8.12159V9.6731H9.14273V8.12159H7.61892ZM10.6665 8.12159V9.6731H12.1903V8.12159H10.6665ZM9.14273 6.57007V8.12159H10.6665V6.57007H9.14273ZM6.09511 6.57007V8.12159H7.61892V6.57007H6.09511ZM3.04749 6.57007V8.12159H4.5713V6.57007H3.04749Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1157_2617">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">6</h5>
              <p className="text-secondary-text text-sm">United States</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_414_26060)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="#249F58"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.0003 3.4668L27.4289 12.0001L16.0003 20.5335L4.57178 12.0001"
                    fill="#FFDA2C"
                  />
                  <path
                    d="M16.0003 17.4304C18.9458 17.4304 21.3337 14.9992 21.3337 12.0001C21.3337 9.00105 18.9458 6.56982 16.0003 6.56982C13.0548 6.56982 10.667 9.00105 10.667 12.0001C10.667 14.9992 13.0548 17.4304 16.0003 17.4304Z"
                    fill="#1A47B8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7146 14.3276V15.8792H15.2384V14.3276H13.7146ZM16.7622 14.3276V15.8792H18.286V14.3276H16.7622Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.1904 9.67285C12.1904 9.67285 15.6403 10.2935 18.1272 11.3764L21.3333 12.7759"
                    fill="white"
                  />
                  <path
                    d="M12.1904 9.67285C12.1904 9.67285 15.6403 10.2935 18.1272 11.3764L21.3333 12.7759"
                    stroke="white"
                    stroke-width="1.45455"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_414_26060">
                    <rect
                      width="32"
                      height="23.2727"
                      fill="white"
                      transform="translate(0 0.36377)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">8</h5>
              <p className="text-secondary-text text-sm">Brazil</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1157_2617)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 0.36377H13.7143V11.2244H0V0.36377Z"
                    fill="#1A47B8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7143 0.36377V1.91528H32V0.36377H13.7143ZM13.7143 3.4668V5.01831H32V3.4668H13.7143ZM13.7143 6.56983V8.12135H32V6.56983H13.7143ZM13.7143 9.67286V11.2244H32V9.67286H13.7143ZM0 12.7759V14.3274H32V12.7759H0ZM0 15.8789V17.4304H32V15.8789H0ZM0 18.982V20.5335H32V18.982H0ZM0 22.085V23.6365H32V22.085H0Z"
                    fill="#F93939"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.52368 1.91553V3.46704H3.04749V1.91553H1.52368ZM4.5713 1.91553V3.46704H6.09511V1.91553H4.5713ZM7.61892 1.91553V3.46704H9.14273V1.91553H7.61892ZM10.6665 1.91553V3.46704H12.1903V1.91553H10.6665ZM9.14273 3.46704V5.01856H10.6665V3.46704H9.14273ZM6.09511 3.46704V5.01856H7.61892V3.46704H6.09511ZM3.04749 3.46704V5.01856H4.5713V3.46704H3.04749ZM1.52368 5.01856V6.57007H3.04749V5.01856H1.52368ZM4.5713 5.01856V6.57007H6.09511V5.01856H4.5713ZM7.61892 5.01856V6.57007H9.14273V5.01856H7.61892ZM10.6665 5.01856V6.57007H12.1903V5.01856H10.6665ZM1.52368 8.12159V9.6731H3.04749V8.12159H1.52368ZM4.5713 8.12159V9.6731H6.09511V8.12159H4.5713ZM7.61892 8.12159V9.6731H9.14273V8.12159H7.61892ZM10.6665 8.12159V9.6731H12.1903V8.12159H10.6665ZM9.14273 6.57007V8.12159H10.6665V6.57007H9.14273ZM6.09511 6.57007V8.12159H7.61892V6.57007H6.09511ZM3.04749 6.57007V8.12159H4.5713V6.57007H3.04749Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1157_2617">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">6</h5>
              <p className="text-secondary-text text-sm">United States</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_414_26060)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="#249F58"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.0003 3.4668L27.4289 12.0001L16.0003 20.5335L4.57178 12.0001"
                    fill="#FFDA2C"
                  />
                  <path
                    d="M16.0003 17.4304C18.9458 17.4304 21.3337 14.9992 21.3337 12.0001C21.3337 9.00105 18.9458 6.56982 16.0003 6.56982C13.0548 6.56982 10.667 9.00105 10.667 12.0001C10.667 14.9992 13.0548 17.4304 16.0003 17.4304Z"
                    fill="#1A47B8"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.7146 14.3276V15.8792H15.2384V14.3276H13.7146ZM16.7622 14.3276V15.8792H18.286V14.3276H16.7622Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.1904 9.67285C12.1904 9.67285 15.6403 10.2935 18.1272 11.3764L21.3333 12.7759"
                    fill="white"
                  />
                  <path
                    d="M12.1904 9.67285C12.1904 9.67285 15.6403 10.2935 18.1272 11.3764L21.3333 12.7759"
                    stroke="white"
                    stroke-width="1.45455"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_414_26060">
                    <rect
                      width="32"
                      height="23.2727"
                      fill="white"
                      transform="translate(0 0.36377)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">8</h5>
              <p className="text-secondary-text text-sm">Brazil</p>
            </div>
          </li>

          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1157_23200)">
                  <rect
                    y="0.36377"
                    width="32"
                    height="23.2727"
                    rx="2.90909"
                    fill="#1A47B8"
                  />
                  <path
                    d="M28.9524 0.36377H3.04762C1.36447 0.36377 0 1.75304 0 3.4668V20.5335C0 22.2472 1.36447 23.6365 3.04762 23.6365H28.9524C30.6355 23.6365 32 22.2472 32 20.5335V3.4668C32 1.75304 30.6355 0.36377 28.9524 0.36377Z"
                    fill="#1A47B8"
                  />
                  <path
                    opacity="0.5"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M6.09521 18.2064L7.61902 17.4307L8.38093 15.8792L9.14283 17.4307L10.6666 18.2064L9.14283 18.9822L8.38093 20.5337L7.61902 18.9822L6.09521 18.2064ZM21.3333 5.01855V6.57007H22.8571V5.01855H21.3333ZM25.9047 6.57007V8.12158H27.4285V6.57007H25.9047ZM19.8095 9.6731V11.2246H21.3333V9.6731H19.8095ZM24.3809 11.2246V12.7761H25.9047V11.2246H24.3809ZM22.8571 15.8792V17.4307H24.3809V15.8792H22.8571Z"
                    fill="white"
                  />
                  <path
                    d="M13.7142 1.91553H3.04749C2.20591 1.91553 1.52368 2.61016 1.52368 3.46704V11.2246C1.52368 12.0815 2.20591 12.7761 3.04749 12.7761H13.7142C14.5557 12.7761 15.238 12.0815 15.238 11.2246V3.46704C15.238 2.61016 14.5557 1.91553 13.7142 1.91553Z"
                    fill="white"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.61904 8.12134H3.04761V6.56983H7.61904V3.4668H9.14285V6.56983H13.7143V8.12134H9.14285V11.2244H7.61904V8.12134ZM11.4286 9.67286V11.2244H13.7143V9.67286H11.4286ZM11.4286 3.4668V5.01831H13.7143V3.4668H11.4286ZM3.04761 9.67286V11.2244H5.33332V9.67286H3.04761ZM3.04761 3.4668V5.01831H5.33332V3.4668H3.04761Z"
                    fill="#F93939"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1157_23200">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">31</h5>
              <p className="text-secondary-text text-sm">Australia</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_414_26075)">
                  <g clip-path="url(#clip1_414_26075)">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0 0.36377H10.1818V23.6365H0V0.36377Z"
                      fill="#1A47B8"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.8181 0.36377H31.9999V23.6365H21.8181V0.36377Z"
                      fill="#F93939"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_414_26075">
                    <rect
                      width="32"
                      height="23.2727"
                      fill="white"
                      transform="translate(0 0.36377)"
                    />
                  </clipPath>
                  <clipPath id="clip1_414_26075">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">42</h5>
              <p className="text-secondary-text text-sm">France</p>
            </div>
          </li>
          <li className="flex items-center gap-5">
            {/* Flag */}
            <div>
              <svg
                width="32"
                height="24"
                viewBox="0 0 32 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_414_26065)">
                  <g clip-path="url(#clip1_414_26065)">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16 15.8792C18.1028 15.8792 19.8095 14.1415 19.8095 12.0004C19.8095 9.85928 18.1028 8.12158 16 8.12158C13.8971 8.12158 12.1904 9.85928 12.1904 12.0004C12.1904 14.1415 13.8971 15.8792 16 15.8792ZM16 14.3276C17.2617 14.3276 18.2857 13.285 18.2857 12.0004C18.2857 10.7157 17.2617 9.6731 16 9.6731C14.7382 9.6731 13.7142 10.7157 13.7142 12.0004C13.7142 13.285 14.7382 14.3276 16 14.3276Z"
                      fill="#1A47B8"
                    />
                    <path
                      d="M15.9999 12.7761C16.4207 12.7761 16.7618 12.4288 16.7618 12.0004C16.7618 11.5719 16.4207 11.2246 15.9999 11.2246C15.5792 11.2246 15.238 11.5719 15.238 12.0004C15.238 12.4288 15.5792 12.7761 15.9999 12.7761Z"
                      fill="#1A47B8"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0 16.3638H32V23.6365H0V16.3638Z"
                      fill="#249F58"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0 0.36377H32V7.6365H0V0.36377Z"
                      fill="#FF6C2D"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_414_26065">
                    <rect
                      width="32"
                      height="23.2727"
                      fill="white"
                      transform="translate(0 0.36377)"
                    />
                  </clipPath>
                  <clipPath id="clip1_414_26065">
                    <rect
                      y="0.36377"
                      width="32"
                      height="23.2727"
                      rx="2.90909"
                      fill="white"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            {/* Stats */}
            <div className="flex flex-col">
              <h5 className="font-semibold font-roboto text-white">21</h5>
              <p className="text-secondary-text text-sm">India</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SignupsByLocation;
