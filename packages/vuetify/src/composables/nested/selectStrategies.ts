/* eslint-disable sonarjs/no-identical-functions */
// Utilities
import { toRaw } from 'vue'

type SelectStrategyFunction = (data: {
  id: unknown
  value: boolean
  selected: Map<unknown, 'on' | 'off' | 'indeterminate'>
  children: Map<unknown, unknown[]>
  parents: Map<unknown, unknown>
  disabled: Set<unknown>
  event?: Event
}) => Map<unknown, 'on' | 'off' | 'indeterminate'>

type SelectStrategyTransformInFunction = (
  v: readonly unknown[] | undefined,
  children: Map<unknown, unknown[]>,
  parents: Map<unknown, unknown>,
  disabled: Set<unknown>,
) => Map<unknown, 'on' | 'off' | 'indeterminate'>

type SelectStrategyTransformOutFunction = (
  v: Map<unknown, 'on' | 'off' | 'indeterminate'>,
  children: Map<unknown, unknown[]>,
  parents: Map<unknown, unknown>,
) => unknown[]

export type SelectStrategy = {
  select: SelectStrategyFunction
  in: SelectStrategyTransformInFunction
  out: SelectStrategyTransformOutFunction
}

export const independentSelectStrategy = (mandatory?: boolean): SelectStrategy => {
  const strategy: SelectStrategy = {
    select: ({ id, value, selected }) => {
      id = toRaw(id)

      // When mandatory and we're trying to deselect when id
      // is the only currently selected item then do nothing
      if (mandatory && !value) {
        const on = Array.from(selected.entries())
          .reduce((arr, [key, value]) => {
            if (value === 'on') arr.push(key)
            return arr
          }, [] as unknown[])
        if (on.length === 1 && on[0] === id) return selected
      }

      selected.set(id, value ? 'on' : 'off')

      return selected
    },
    in: (v, children, parents, disabled) => {
      const map = new Map()

      for (const id of (v || [])) {
        strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled,
        })
      }

      return map
    },
    out: v => {
      const arr = []

      for (const [key, value] of v.entries()) {
        if (value === 'on') arr.push(key)
      }

      return arr
    },
  }

  return strategy
}

export const independentSingleSelectStrategy = (mandatory?: boolean): SelectStrategy => {
  const parentStrategy = independentSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: ({ selected, id, ...rest }) => {
      id = toRaw(id)
      const singleSelected = selected.has(id) ? new Map([[id, selected.get(id)!]]) : new Map()
      return parentStrategy.select({ ...rest, id, selected: singleSelected })
    },
    in: (v, children, parents, disabled) => {
      if (v?.length) {
        return parentStrategy.in(v.slice(0, 1), children, parents, disabled)
      }

      return new Map()
    },
    out: (v, children, parents) => {
      return parentStrategy.out(v, children, parents)
    },
  }

  return strategy
}

export const leafSelectStrategy = (mandatory?: boolean): SelectStrategy => {
  const parentStrategy = independentSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: ({ id, selected, children, ...rest }) => {
      id = toRaw(id)
      if (children.has(id)) return selected

      return parentStrategy.select({ id, selected, children, ...rest })
    },
    in: parentStrategy.in,
    out: parentStrategy.out,
  }

  return strategy
}

export const leafSingleSelectStrategy = (mandatory?: boolean): SelectStrategy => {
  const parentStrategy = independentSingleSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: ({ id, selected, children, ...rest }) => {
      id = toRaw(id)
      if (children.has(id)) return selected

      return parentStrategy.select({ id, selected, children, ...rest })
    },
    in: parentStrategy.in,
    out: parentStrategy.out,
  }

  return strategy
}

export const classicSelectStrategy = (mandatory?: boolean): SelectStrategy => {
  const strategy: SelectStrategy = {
    select: ({ id, value, selected, children, parents, disabled }) => {
      id = toRaw(id)
      const original = new Map(selected)

      const items = [id]

      while (items.length) {
        const item = items.shift()!

        if (!disabled.has(item)) {
          selected.set(toRaw(item), value ? 'on' : 'off')
        }

        if (children.has(item)) {
          items.push(...children.get(item)!)
        }
      }

      let parent = toRaw(parents.get(id))

      while (parent) {
        let everySelected = true
        let noneSelected = true

        for (const child of children.get(parent)!) {
          const cid = toRaw(child)

          if (disabled.has(cid)) continue
          if (selected.get(cid) !== 'on') everySelected = false
          if (selected.has(cid) && selected.get(cid) !== 'off') noneSelected = false
          if (!everySelected && !noneSelected) break
        }

        selected.set(parent, everySelected ? 'on' : noneSelected ? 'off' : 'indeterminate')

        parent = toRaw(parents.get(parent))
      }

      // If mandatory and planned deselect results in no selected
      // items then we can't do it, so return original state
      if (mandatory && !value) {
        const on = Array.from(selected.entries())
          .reduce((arr, [key, value]) => {
            if (value === 'on') arr.push(key)
            return arr
          }, [] as unknown[])
        if (on.length === 0) return original
      }

      return selected
    },
    in: (v, children, parents, disabled) => {
      let map = new Map()

      for (const id of (v || [])) {
        map = strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled,
        })
      }

      return map
    },
    out: (v, children) => {
      const arr = []

      for (const [key, value] of v.entries()) {
        if (value === 'on' && !children.has(key)) arr.push(key)
      }

      return arr
    },
  }

  return strategy
}

export const trunkSelectStrategy = (mandatory?: boolean): SelectStrategy => {
  const parentStrategy = classicSelectStrategy(mandatory)

  const strategy: SelectStrategy = {
    select: parentStrategy.select,
    in: parentStrategy.in,
    out: (v, children, parents) => {
      const arr = []

      for (const [key, value] of v.entries()) {
        if (value === 'on') {
          if (parents.has(key)) {
            const parent = parents.get(key)
            if (v.get(parent) === 'on') continue
          }
          arr.push(key)
        }
      }

      return arr
    },
  }

  return strategy
}
