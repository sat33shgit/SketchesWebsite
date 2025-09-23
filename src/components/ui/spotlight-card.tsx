import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode
}

export const GlowCard = ({ children, className = '', ...rest }: Props) => {
	return (
		<div className={`${className} relative`} {...rest}>
			{children}
		</div>
	)
}

export default GlowCard
